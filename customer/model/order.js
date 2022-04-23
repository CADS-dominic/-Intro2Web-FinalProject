const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const Order = new Schema({
    productList: { type: Array, required: true},
    totalPrice: {type: String, required: true},
    status: {type: String, required: true},
    address: {type: String, required: true},
    iat: {type: String, required: true},
})

module.exports = mongoose.model('orders', Order)