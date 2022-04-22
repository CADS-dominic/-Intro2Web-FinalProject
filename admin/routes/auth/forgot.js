var express = require('express')
var router = express.Router()
var { adminCollection } = require('../../db')
var bcrypt = require('bcrypt')
const passport = require('passport')
const nodemailer = require('nodemailer')
require('dotenv').config()

async function sendForgotMail(username, url) {
	let transporter = nodemailer.createTransport({
		service: 'gmail',
		host: 'smtp.gmail.com',
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
	})
	let info = await transporter.sendMail({
		from: 'SneakerJeeps@gmail.com',
		to: username,
		subject: 'Reset your password',
		html: `<a href='${url}/forgot/form?username=${username}'>Click this link to reset your password</a>`,
	})
	//console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

router.get('/', passport.checkNotAuth, function (req, res) {
	res.render('auth/forgot')
})

router.get('/waiting', passport.checkNotAuth, (req, res) => {
	const url = req.protocol + '://' + req.get('host')
	if (req.query.username != '') {
		sendForgotMail(req.query.username, url)
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
