require('dotenv').config();
const { loginToIngram } = require('./login');
const { scrapeOrder } = require('./scrapeOrder');
// const { searchPo } = require('./searchPo');
const parseInvoice = require('./InvoiceParsing/parseInvoice');
const { searchPo } = require('./orderPageActions');
const { parseOutShipments, addTrackingAndAddress } = require('./mutateOrderData');

const ingramOrder = process.env.INGRAM_ORDER_PAGE;

// let userData = {
//     ingramU: process.env.INGRAM_U,
//     ingramP: process.env.INGRAM_P,
//     po: process.env.INGRAM_CUSTOMER_PO,
// }

// User data should be filled via the client - during login - just like po
const getOrderInfo = async (userData) => {
    const page = await loginToIngram(userData)
                        .then(async browser => (await browser.pages())[1]);
    // Navigation work-around
    // await page.goto('about:blank');
    // // Go to order page
    await page.goto(ingramOrder);
    // Switch over to....
    await searchPo(page, userData.po);

    const orderData = await scrapeOrder(page);

    const parseTrackingAndAddress = await parseInvoice.getAllTracking(orderData, page, true);

    // const address = trackingAndAddresses[0][2];
   
    const newOrderData = await addTrackingAndAddress(parseTrackingAndAddress, orderData);
    console.log(newOrderData, "data with addy & tracking");
    
    const parsedOutShipments = parseOutShipments(newOrderData);
    console.log(parsedOutShipments, "parsed out shipments");
    
    return parsedOutShipments;
}

// console.log(getOrderInfo(userData), "end of main");
const getOrderInfo2 = async (page, userData) => {
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
    console.log(newOrderData, "data with addy & tracking");
    const parsedOutShipments = parseOutShipments(newOrderData);
    console.log(parsedOutShipments, "parsed out shipments");
    return parsedOutShipments;
}

exports.getOrderInfo2 = getOrderInfo2;
exports.getOrderInfo = getOrderInfo;