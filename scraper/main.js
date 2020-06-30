const { loginToIngram } = require('./login');
const { scrapeOrder } = require('./scrapeOrder');
const { searchPo } = require('./searchPo');
const tracking = require('./parseInvoice');

const ingramOrder = process.env.INGRAM_ORDER_PAGE;

let userData = {
    ingramU: process.env.INGRAM_U,
    ingramP: process.env.INGRAM_P,
    po: process.env.INGRAM_CUSTOMER_PO,
}

const addTrackingAndAddress = async (trackingAndAddresses, orderData) => {
    const copiedData = await Object.assign({}, orderData);
    // Add tracking to orderData (mutating orderData)
    const address = trackingAndAddresses[0][2];
    trackingAndAddresses.forEach(num => {
        const orderByIndex = copiedData[num[0]];
        orderByIndex.tracking = num[1];
        orderByIndex.address = address;
    });
    console.log(copiedData);
    console.log(trackingAndAddresses, "TRACKING");
    return copiedData;
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

    const trackingAndAddresses = await tracking.getAllTracking(orderData, page, true);

    // const address = trackingAndAddresses[0][2];
   
    return addTrackingAndAddress(trackingAndAddresses, orderData);
}

// getOrderInfo(userData);

exports.getOrderInfo = getOrderInfo;