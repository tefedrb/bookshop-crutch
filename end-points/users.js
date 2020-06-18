const express = require('express');
const router = express.Router();
const User = require('../models/User');
// router.get('/', (req, res) => {
//     res.send("Testing");
// });

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        // FIND IS A METHOD WITH MOONGOSE
        res.json(users);
    } catch(err){
        res.json({ message: err })
    }
});

router.post('/', async (req, res) => {
    console.log(req.body)
    const user = new User({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email
    });

    // user.save()
    //     .then(data => {
    //         // Add status code 200
           
    //         res.json(data);
    //     })
    //     .catch(err => {
    //         res.json({ message: err })
    //     });
    //
    // *** ABOVE REFACTORED BELOW ***
    try {
        const savedUser = await user.save();
        res.json(savedUser);
    } catch (err){
        res.json({ message: err })
    }
});

// Get back specific user
router.get('/:userId', async (req, res) => {
    try {
        const targetUser = await User.findById(req.params.userId);
        res.json(targetUser);
    } catch(err){
        res.json({ message: err });
    }
});

module.exports = router;

// Delete specific user

router.delete('/:userId', async (req, res) => {
    try {
        const removedUser = await User.remove( { _id: req.params.userId } )
        res.json(removedUser);
    } catch(err){
        res.json({ message: err });
    }
});

// Update a user

router.patch('/:userId', async (req, res) => {
    try {
        const updatedUser = await User.updateOne(
            { _id: req.params.userId },
            { $set: { username: req.body.username } }
        );
        res.json(updatedUser);
    } catch(err){
        res.json({ message: err });
    }
});