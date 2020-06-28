const { loginToIngram } = require('./login');
const { scrapeOrder } = require('./scrapeOrder');
const { searchPo } = require('./searchPo');
const tracking = require('./parse');

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

    const trackingNumbers = await tracking.getAllTracking(orderData, page);

    // Add tracking to orderData (mutating orderData)
    trackingNumbers.forEach(num => orderData[num[1]].tracking = num[0]);
    console.log(orderData);
    console.log(trackingNumbers, "TRACKING");
}

runScript(userData);