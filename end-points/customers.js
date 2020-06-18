const express = require('express');
const router = express.Router();
const Customer = require('../models/Customer');
const verify = require('./tokenVerification');

router.get('/', verify, async (req, res) => {
    
    res.json({ 
        posts: {
            title: 'testing secure route', 
            description: 'random' 
        }
    });
})

// Create new customer
router.post('/', verify, async (req, res) => {
    const customer = new Customer({
        name: req.body.name,
        email: req.body.email,
        cases: [...req.body.cases],
        orders: [...req.body.orders]
    });
    
    try {
        const saveCustomer = await customer.save();
        res.json(saveCustomer);
    } catch (err){
        res.json({ message: err })
    }
    // res.json({ 
    //     posts: {
    //         title: 'testing secure route', 
    //         description: 'random' 
    //     }
    // });
})

module.exports = router;
