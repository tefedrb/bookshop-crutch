const express = require('express');

const app = express();

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
// How to start listening to the server
app.listen(3000);