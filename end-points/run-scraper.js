const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const main = require('../scraper/main');

// Need to add verify as middleware for token authentication
router.get('/', async (req, res) => {
    try{
        const orderData = await main.getOrderInfo({
            ingramU: process.env.INGRAM_U,
            ingramP: process.env.INGRAM_P,
            po: process.env.INGRAM_CUSTOMER_PO
        })
        
        res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
})

module.exports = router;