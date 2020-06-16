const express = require('express');
const app = express();
const mongoose = require('mongoose')
require('dotenv/config');

// Middleware
// app.use('/posts', () =>{
//     console.log('This is a middleware running');
// })

// NOW YOU HAVE THE ABILITY TO ADD ROUTES IN A VERY SIMPLE WAY

// ROUTES
app.get('/', (req,res) => {
    res.send('We are on fire (home)');
})

app.get('/posts', (req,res) => {
    res.send('Super easy...');
})


// Connect to DB
mongoose.connect(process.env.DB_CONNECTION, { useNewUrlParser: true }, () => console.log("connected to db"))

// How to start listening to the server
app.listen(3000);

