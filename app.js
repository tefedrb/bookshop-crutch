const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config()

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import routes
const userRoute = require('./end-points/users');
const authRoute = require('./end-points/userAuth');
const customerRoute = require('./end-points/customers');

// Route Middleware
app.use('/user', userRoute);
app.use('/user/auth', authRoute);
app.use('/customers', customerRoute);


// app.use('/posts', () =>{
//     console.log('This is a middleware running');
// })

// NOW YOU HAVE THE ABILITY TO ADD ROUTES IN A VERY SIMPLE WAY

// ROUTES
app.get('/', (req,res) => {
    res.send('We are on fire (home)');
})

// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log("connected to db"))

// How to start listening to the server
app.listen(3000);

