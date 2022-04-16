var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
const passport = require('passport')

router.get('/', function (req, res) {
	res.render('auth/login')
})

router.post(
	'/login',
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/',
	})
)

router.get('/logout', function (req, res) {
	req.logout()
	res.redirect('/')
})

module.exports = router
