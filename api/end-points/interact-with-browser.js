const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const connect = require('../../scraper/connect-to-browser');
const { scrapeOrder, goToOrder } = require('../../scraper/scrapeOrder');
const { parseOutShipments } = require('../../scraper/mutateOrderData');
const { getAllShipmentInvoiceInfo } = require('../../scraper/InvoiceParsing/parseInvoice');
const { searchPo, navigateToAndScrapeBookInfo,  } = require('../../scraper/orderPageActions');
const { verifyStillLoggedIn } = require('../../scraper/check-if-logged-out');
const { scrapeUSPSTracking, scrapeUPSTracking } = require('../../scraper/postal-service-scrape');
const { json } = require('express');

router.post('/verify-login', async (req, res) => {
    try {
        
    } catch (err){
        res.json({ message: err })
    }
})

router.post('/connect', async (req, res) => {
    // Here instead of using an environment var, we are trying to use
    // a URL parameter
    console.log(req.body, "request Body");

    try {
        console.log('in try catch for interact w/ browser...')
        const browser = await connect.connectToBrowser(req.body.wsUrl, res.body.terminate || null);
        // const ingramLogin = await login.loginToIngram(req.body)
        //     .then(async browser => {
        //         const page = (await browser.pages())[1]
        //         const pageUrl = page.url();
                
        //         return [browser.wsEndpoint(), pageUrl]}
        //     );
        // console.log(ingramLogin, "INGRAM LOGIN")
        // console.log(browser);
        if(browser){
            res.send({message: "connected to browser"});
        } else {
            res.send({message: "not connected"});
        }
        // return res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
});

// CREATE MIDDLEWARE FUNCTION, LIKE VERIFY, THAT INSERTS CONNECT TO BROWSER FUNC

// THIS METHOD IS BEING PHASED OUT - SEARCHPO
router.post('/search-by-po', async (req, res) => {
    // I need to make sure I am navigating to the order page b4 moving on
    try { 
         const page = await connect.connectToBrowser(req.body.wsUrl)
                .then(async browser => (await browser.pages())[0]);
     
         await page.goto(process.env.INGRAM_ORDER_PAGE, { waitUntil: 'networkidle0' });
        
         const verified = await verifyStillLoggedIn(page);
         console.log(verified, "VERIFIED")
         if(verified.loggedIn){
            await searchPo(page, req.body.poNum);
            res.json({ message: "ok" });
         } else {
            res.json({ message:"Logged Out Of Ingram" })
         }
     } catch(err){
        res.json({ message: err });
     }
 });

// Returns order data - parsedoutshipments
router.post('/scrape-po-info', async (req, res) => {
    try {
        // // Create a method that checks if logged out
        // Manipulate page from within the 
        await goToOrder(req.body.wsUrl, req.body.po);

        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(async browser => (await browser.pages())[0]);

            const verified = await verifyStillLoggedIn(page);
            console.log(verified, "VERIFIED")
        if(verified?.loggedIn){
            const orderData = await scrapeOrder(page);
            
            if(orderData.error){
                res.json(orderData);
            } else {
                const parsedShipments = parseOutShipments(orderData);
                parsedShipments.orderUrl = page.url();
                res.json(parsedShipments);
            }
        } else {
            res.json({ error: "Logged Out" })
        }
    } catch(err){
        res.json({ message: err });
    }
});

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
});

router.post('/get-all-book-info', async (req, res) => {
    // HERE WE ARE ADDING A .MODALINFO TO EACH BOOK OBJECT - EACH BOOK IS GETTING THE SCRAPE - navigateToAndScrapeBookInfo
    try {
        const page = await connect.connectToBrowser(req.body.wsUrl)
            .then(async browser => (await browser.pages())[1]);
        console.log("In getAllBooks");
        const orderData = req.body.orderData;
        // console.log(orderData.shipments[0][0].Ean[1], "ORDER DATA IN ALLBOOKS")
        if(orderData.shipments.length > 0){
            for(let i = 0; i < orderData.shipments.length; i++){
                for(let j = 0; j < orderData.shipments[i].length; j++){
                    console.log("made it into loop...");
                    console.log(orderData.shipments[i][j].Ean[1], "this link....");
                    const bookInfo = 
                        await navigateToAndScrapeBookInfo(page, orderData.shipments[i][j].Ean[1]);

                    orderData.shipments[i][j].modalInfo = bookInfo;
                    console.log(bookInfo, "< bookinfo")
                }
            }
        }
        for(let i = 0; i < orderData.unshipped.length; i++){
            const bookInfo = 
                await navigateToAndScrapeBookInfo(page, orderData.unshipped[i].Ean[1]);
                
            orderData.unshipped[i].modalInfo = bookInfo;
            console.log(bookInfo, "IN UNSHIPPED BOOKS")
        }
        res.json(orderData);
    } catch(err){
        res.json({ message: "get-all-book-info: " + err.message });
    }
});

router.post('/get-data-from-usps-tracking', async (req, res) => {
    // Create a new page, go to page and scrape. close page.
    try {
        const browser = await connect.connectToBrowser(req.body.wsUrl);
        const newPage = await browser.newPage();
        const uspsUrl = "https://tools.usps.com/go/TrackConfirmAction?qtc_tLabels1=";
        const trackingNumber = req.body.uspsTracking;
        await newPage.goto(uspsUrl + trackingNumber, { waitUntil: 'networkidle0' });
        const uspsTrackingData = await scrapeUSPSTracking(newPage);
        console.log(uspsTrackingData, "TRACKING DATA");
        await newPage.close();
        res.json(uspsTrackingData);
    } catch(err){
        res.json({ message: 'ERROR in get-data-from-usps-tracking: ' + err.message });
    }
});

router.post('/get-data-from-ups-tracking', async (req, res) => {
    try {
        const browser = await connect.connectToBrowser(req.body.wsUrl);
        const newPage = await browser.newPage();
        const trackingNumber = req.body.upsTracking;
        const upsUrl = `https://www.ups.com/track?loc=en_US&tracknum=${trackingNumber}&requester=WT/trackdetails`;
        await newPage.goto(upsUrl, { waitUntil: 'load' });
        const upsTrackingData = await scrapeUPSTracking(newPage);
        await newPage.close();
        res.json(upsTrackingData);
    } catch(err){
        res.json({ message: 'ERROR in get-data-from-ups-tracking: ' + err.message });
    }
});

router.post('/check-browser-connection/', async (req, res) => {
    try {
        const wsEndpoint = req.body.wsUrl;
        const browserCheck = await connect.checkBrowserConnection(wsEndpoint);
        res.send({ browserStatus: browserCheck });
    } catch(err){
        res.json({ message: 'ERROR in check-browser-connection' + err.message });
    }
});

module.exports = router;