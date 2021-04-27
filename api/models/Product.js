const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        default: 1
    },
    date: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model('Product', productSchema);
