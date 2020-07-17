const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const connect = require('../../scraper/connect-to-browser');
const { scrapeOrder } = require('../../scraper/scrapeOrder');
const { parseOutShipments } = require('../../scraper/mutateOrderData');
const { getAllShipmentInvoiceInfo } = require('../../scraper/parseInvoice');
const { searchPo, navigateToAndScrapeBookInfo } = require('../../scraper/orderPageActions');

router.post('/connect', async (req, res) => {
    // Here instead of using an environment var, we are trying to use
    // a URL parameter
    console.log(req.body, "request Body");

    try {
        console.log('in try catch for interact w/ browser...')
        const browser = await connect.connectToBrowser(req.body.wsUrl);
        // const ingramLogin = await login.loginToIngram(req.body)
        //     .then(async browser => {
        //         const page = (await browser.pages())[1]
        //         const pageUrl = page.url();
                
        //         return [browser.wsEndpoint(), pageUrl]}
        //     );
        // console.log(ingramLogin, "INGRAM LOGIN")
        res.send(browser);
        // return res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
})

// CREATE MIDDLEWARE FUNCTION, LIKE VERIFY, THAT INSERTS CONNECT TO BROWSER FUNC
router.post('/search-by-po', async (req, res) => {
    // I need to make sure I am navigating to the order page b4 moving on
    try { 
        // const testCB = async (browser) => {
        //     const page = await (browser.pages())[1];
        //     await page.goto("https://ipage.ingramcontent.com/ipage/or101.jsp?ipsInd=N");
        // }
         console.log(req.body.wsUrl, "URL")
         const page = await connect.connectToBrowser(req.body.wsUrl)
                 .then(async browser => (await browser.pages())[0]);
        // const pages = await page.pages();
        // const page1 = pages[0]
        // console.log(page, "TESTING")

         await page.goto(process.env.INGRAM_ORDER_PAGE, { waitUntil: 'networkidle0' });
        
         await searchPo(page, req.body.poNum);

         res.json("ok");
     } catch(err){
         res.json({ message: err });
     }
 })

// Returns order data - parsedoutshipments
router.post('/scrape-po-info', async (req, res) => {
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(async browser => (await browser.pages())[0]);
        
        const orderData = await scrapeOrder(page);

        const parsedShipments = parseOutShipments(orderData);
        res.json(parsedShipments);
    } catch(err){
        res.json({ message: err });
    }
})

// returns [[tracking, address, shipment_idx], [tracking, address, shipment_idx] ...]
router.post('/get-all-invoice-info', async (req, res) => {
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(async browser => (await browser.pages())[0]);
        const invoiceInfoForShipments = 
            await getAllShipmentInvoiceInfo(page, req.body.orderData, true);
        res.json(invoiceInfoForShipments);
    } catch(err){
        res.json({ message: err.message });
    }
})

router.post('/get-all-book-info', async (req, res) => {
    // HERE WE ARE ADDING A .MODALINFO TO EACH BOOK OBJECT - EACH BOOK IS GETTING THE SCRAPE - navigateToAndScrapeBookInfo
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(async browser => (await browser.pages())[1]);
        console.log("In getAllBooks");
        const orderData = req.body.orderData;
        console.log(orderData.shipments[0][0].Ean[1], "ORDER DATA IN ALLBOOKS")
        for(let i = 0; i < orderData.shipments.length; i++){
            for(let j = 0; j < orderData.shipments[i].length; j++){
                console.log("made it into loop...");
                console.log(orderData.shipments[i][j].Ean[1], "this link....")
                const bookInfo = 
                    await navigateToAndScrapeBookInfo(page, orderData.shipments[i][j].Ean[1]);
                orderData.shipments[i][j].modalInfo = bookInfo;
            }
        }
        for(let i = 0; i < orderData.unshipped.length; i++){
            const bookInfo = 
                await navigateToAndScrapeBookInfo(page, orderData.unshipped[i].Ean[1]);
            orderData.unshipped[i].modalInfo = bookInfo;
        }
        res.json(orderData);
    } catch(err){
        res.json({ message: "get-all-book-info: " + err.message });
    }
})

module.exports = router;