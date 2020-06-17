const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv/config');


app.use(bodyParser.json());
// Import routes
const testRoute = require('./end-points/users');

app.use('/test', testRoute);

// Middleware

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

