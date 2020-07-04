const { loginToIngram } = require('./login');
const { scrapeOrder } = require('./scrapeOrder');
const { searchPo } = require('./searchPo');
const parseInvoice = require('./parseInvoice');

const ingramOrder = process.env.INGRAM_ORDER_PAGE;

let userData = {
    ingramU: process.env.INGRAM_U,
    ingramP: process.env.INGRAM_P,
    po: process.env.INGRAM_CUSTOMER_PO,
}

const parseOutShipments = (orderData) => {
    // An array with objects - each object is a book
    // Need to see if they have an invoice number, use cache to record it
    const cache = {};
    const output = {
        "shipments": [],
        "unshipped": []
    };
    // Create an object with shipments - an array - and unshipped
    orderData.forEach(order => {
        const invoice = order['Invoice Number'];
        const invoiceNumber = invoice[0];
        if(invoice){
            if(!cache[invoiceNumber]){
                cache[invoiceNumber] = [];
            }
            cache[invoiceNumber].push(order);
        } else {
            output.unshipped.push(order);
        }
    });
    for(let shipment in cache){
        output.shipments.push(cache[shipment]);
    }
    return output;
}

// This mutates objects
const addTrackingAndAddress = async (trackingAndAddresses, orderData) => {
    // Add tracking to orderData (mutating orderData)
    const address = trackingAndAddresses[0][2];
    trackingAndAddresses.forEach(num => {
        const orderByIndex = orderData[num[0]];
        orderByIndex.tracking = num[1];
        orderByIndex.address = address;
    });
    console.log(orderData, "orderData");
    return orderData;
}

// User data should be filled via the client - during login - just like po
const getOrderInfo = async (userData) => {
    const page = await loginToIngram(userData)
                        .then(async browser => (await browser.pages())[1]);
    // Navigation work-around
    await page.goto('about:blank');
    // Go to order page
    await page.goto(ingramOrder);
    // Switch over to....
    await searchPo(page, userData.po);

    const orderData = await scrapeOrder(page);

    const parseTrackingAndAddress = await parseInvoice.getAllTracking(orderData, page, true);

    // const address = trackingAndAddresses[0][2];
   
    const newOrderData = await addTrackingAndAddress(parseTrackingAndAddress, orderData);

    const parsedOutShipments = parseOutShipments(newOrderData);
   
    return parsedOutShipments;
}

// console.log(getOrderInfo(userData), "end of main");

exports.getOrderInfo = getOrderInfo;