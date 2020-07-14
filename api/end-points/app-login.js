const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const login = require('../../scraper/login');

// INSTEAD OF LOGGING INTO INGRAM HERE, WE WILL SAVE THAT FOR THE CLIENT
// THIS END-POINT SHOULD BE USED FOR LOGGING INTO APP.

// Need to add verify as middleware for token authentication
router.post('/', async (req, res) => {
    // Here instead of using an environment var, we are trying to use
    // a URL parameter
    console.log(req.body, "request Body");

    try {
        const ingramLogin = await login.loginToIngram(req.body)
            .then(async browser => {
                const page = (await browser.pages())[1]
                const pageUrl = page.url();
                
                return [browser.wsEndpoint(), pageUrl]}
            );
        
        console.log(ingramLogin, "INGRAM LOGIN")
        res.json(ingramLogin);
        // return res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
})

module.exports = router;