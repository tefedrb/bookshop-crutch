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

const runScript = async (userData) => {
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

    // Add tracking to orderData (mutating orderData)
    trackingAndAddresses.forEach(num => {
        const orderByIndex = orderData[num[0]];
        orderByIndex.tracking = num[1];
        orderByIndex.address = num[2];
    });
    console.log(orderData);
    console.log(trackingAndAddresses, "TRACKING");
}

runScript(userData);