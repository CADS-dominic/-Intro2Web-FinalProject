var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
const passport = require('passport')
const cloudinary = require('../../configs/cloudinary')

router.get('/', passport.checkNotAuth, function (req, res) {
	res.render('auth/login')
})

router.post(
	'/login',
	passport.checkNotAuth,
	passport.authenticate('local', {
		successRedirect: '/admin',
		failureRedirect: '/',
	})
)

router.get('/logout', passport.checkAuth, function (req, res) {
	req.logout()
	res.redirect('/')
})

module.exports = router
