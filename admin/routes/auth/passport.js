var express = require('express')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')
var { adminCollection } = require('../../db')

passport.use(
	new LocalStrategy({ usernameField: 'username' }, async function verify(username, password, done) {
		await adminCollection.findOne({ username: username, activate: true }).then((data) => {
			if (data == null) {
				return done(null, false, { error: true })
			} else {
				bcrypt.compare(password, data.password, function (err, result) {
					if (result) {
						return done(null, username)
					} else {
						return done(null, false, { error: true })
					}
				})
			}
		})
	})
)

passport.serializeUser((username, done) => {
	done(null, username)
})

passport.deserializeUser(async function (username, done) {
	await adminCollection.findOne({ username: username }).then((data) => {
		done(null, username)
	})
})

passport.checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/')
	}
}

module.exports = passport
