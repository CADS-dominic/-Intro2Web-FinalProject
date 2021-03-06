var express = require('express')
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var bcrypt = require('bcrypt')
var { adminCollection } = require('../../db')

passport.use(
	new LocalStrategy({ usernameField: 'username' }, async function verify(username, password, done) {
		await adminCollection.findOne({ username: username, verified: true }).then((data) => {
			if (data == null) {
				return done(null, false, { error: true })
			} else {
				bcrypt.compare(password, data.password, function (err, result) {
					if (result) {
						return done(null, data)
					} else {
						return done(null, false, { error: true })
					}
				})
			}
		})
	})
)

passport.serializeUser((user, done) => {
	done(null, user)
})

passport.deserializeUser(async function (user, done) {
	await adminCollection.findOne({ username: user.username }).then((data) => {
		done(null, data)
	})
})

passport.checkAuth = (req, res, next) => {
	if (req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/')
	}
}

passport.checkNotAuth = (req, res, next) => {
	if (!req.isAuthenticated()) {
		next()
	} else {
		res.redirect('/admin')
	}
}

module.exports = passport
