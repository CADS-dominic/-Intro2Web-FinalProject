var express = require('express')
var router = express.Router()
var { adminCollection } = require('../../db')
var bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
require('dotenv').config()

async function sendForgotMail(username) {
	let testAccount = await nodemailer.createTestAccount()
	let transporter = nodemailer.createTransport({
		host: 'smtp.ethereal.email',
		port: 587,
		secure: false,
		auth: {
			user: testAccount.user,
			pass: testAccount.pass,
		},
	})
	let info = await transporter.sendMail({
		from: 'SneakerJeeps@gmail.com',
		to: username,
		subject: 'Reset your password',
		html: `<a href='http://localhost:3000/forgot/form?username=${username}'>Click this link to reset your password</a>`,
	})

	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

router.get('/', passport.checkNotAuth, function (req, res) {
	res.render('auth/forgot')
})

router.get('/waiting', passport.checkNotAuth, (req, res) => {
	if (req.query.username != '') {
		sendForgotMail(req.query.username)
		res.render('auth/forgotWaiting')
	} else {
		res.redirect('/forgot')
	}
})

router.get('/form', passport.checkNotAuth, (req, res) => {
	res.render('auth/forgotForm')
})

router.post('/form', async (req, res) => {
	const { username, password } = req.body
	try {
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection
				.updateOne(
					{
						username: username,
					},
					{
						$set: {
							password: hashed,
						},
					}
				)
				.then(() => {
					req.login(username, () => {})
					res.send({ error: false })
				})
		})
	} catch (e) {
		res.send({ error: true })
	}
})

module.exports = router
