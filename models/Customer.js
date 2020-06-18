const mongoose = require('mongoose');

// Need a way to respond to a specific thread... not create a new email...
const customerSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    cases: [{ open: Boolean, description: String }],
    date: {
        type: Date, 
        default: Date.now
    },
    orders: [
        {
            po: String, 
            dateOrdered: Date, 
            books: [
                {   
                    status: String,
                    ean: String,
                    title: String,
                    format: String,
                    qty: Number, 
                    link: String,
                    invoice: String, 
                    onHand: Number,
                    onOrder: { qt: Number, date: String }
                }
            ]
        }
    ]
});

module.exports = mongoose.model('Customer', customerSchema);