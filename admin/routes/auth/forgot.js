var express = require('express')
var router = express.Router()
var { adminCollection } = require('../../db')
var bcrypt = require('bcrypt')
const passport = require('passport')
require('dotenv').config()

router.get('/', function (req, res) {
	res.render('auth/forgot')
})

module.exports = router
