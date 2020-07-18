const router = require('express').Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { signUpValidation, loginValidation } = require('../validation');

router.post('/sign-up', async (req, res) => {
    const { error } = signUpValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // Checking if the user is already in database
    const emailExists = await User.findOne({ email: req.body.email });
    if(emailExists) return res.status(400).send('Email already exists');

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Creating new user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: hashedPassword
    });

    // Save user
    try {
        const savedUser = await user.save();
        res.status(200).send({user: user._id});
    } catch(err){
        res.status(400).send(err);
    }
})

// LOGIN
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
    try{
        
    // Login failed message
    const invalidUser = 'Wrong email / password';

    // Checking if the email exists
    const retrievedUser = await User.findOne({ email: req.body.email });
    if(!retrievedUser) return res.status(400).send(invalidUser);

    // Check if password is correct
    const validPass = await bcrypt.compare(req.body.password, retrievedUser.password);
    if(!validPass) return res.status(400).send(invalidUser);

    // Create and assign a token (I need to create a time limit)
    const token = jwt.sign({ _id: retrievedUser._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
    // Creating new user
    // const user = new User({
    //     username: req.body.username,
    //     email: req.body.email,
    //     password: hashedPassword
    // });

    // Save user
    
    } catch(err){
        res.status(400).send("Error: " + err);
    }
})


module.exports = router;