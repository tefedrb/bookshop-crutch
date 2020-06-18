const express = require('express');
const router = express.Router();
const verify = require('./verifyToken');

router.get('/', verify, async (req, res) => {
    
    res.json({ 
        posts: {
            title: 'testing secure route', 
            description: 'random' 
        }
    });
})

module.exports = router;
