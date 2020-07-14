const express = require('express');
const router = express.Router();
const verify = require('./tokenVerification');
const main = require('../scraper/main');

// Need to add verify as middleware for token authentication
router.get('/:poNum', async (req, res) => {
    // Here instead of using an environment var, we are trying to use
    // a URL parameter
    try{
        const orderData = await main.getOrderInfo({
            ingramU: process.env.INGRAM_U,
            ingramP: process.env.INGRAM_P,
            po: req.params.poNum
        })
        
        res.json(orderData);
        // return res.json(orderData);
    } catch(err){
        res.json({ message: err });
    }
})

module.exports = router;