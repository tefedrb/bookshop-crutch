const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const connect = require('../../scraper/connect-to-browser');
const { scrapeOrder } = require('../../scraper/scrapeOrder');
const { parseOutShipments } = require('../../scraper/mutateOrderData');
const { getAllShipmentInvoiceInfo } = require('../../scraper/parseInvoice');

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

// Returns order data
router.post('/get-po-info', async (req, res) => {
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(browser => (browser.pages())[1]);
        
        const orderData = await scrapeOrder(page);

        const parsedShipments = parseOutShipments(orderData);
        res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
})

router.post('/get-all-invoice-info', async (req, res) => {
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(browser => (browser.pages())[1]);
        const invoiceInfoForShipments = 
            await getAllShipmentInvoiceInfo(page, req.body.orderData, true);
        res.json(invoiceInfoForShipments);
    } catch(err){
        res.json({ message: err });
    }
})

module.exports = router;