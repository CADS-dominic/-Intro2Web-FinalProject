const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Product = new Schema({
    name: { type: String, required: true},
    price: {type: String, required: true},
    ava: {type: Array, required: true},
    description: {type: String, required: true},
    comment: {type: Array, required: true},
    brand: {type: String, required: true},
    iat: {type: String, required: true},
    status: {type: Boolean, required: true},
})

module.exports = mongoose.model('products', Product)