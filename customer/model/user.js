const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const User = new Schema({
    name: { type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},

    cart: {type: Array, required: false},
    order: {type: Array, required: false},
    ava: {type: String, required: false},
    ban: {type: Boolean, required: false},
    iat: {type: String, required: false},
    wallet: {type: String, required: false},
},  { versionKey: false })

module.exports = mongoose.model('users', User)