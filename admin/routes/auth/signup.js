var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var { adminCollection } = require('../../db')
var nodemailer = require('nodemailer')
var passport = require('passport')

async function sendVerifyMail(username) {
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
		subject: 'Verify your mail',
		html: `<a href='http://localhost:3000/signup/verified?username=${username}'>Click this link to verify your mail</a>`,
	})

	console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}

router.get('/', passport.checkNotAuth, function (req, res) {
	res.render('auth/signup')
})

router.post('/', passport.checkNotAuth, async (req, res, next) => {
	const { username, password, repassword, ava } = req.body

	if (
		username == '' ||
		password == '' ||
		repassword != password ||
		repassword == '' ||
		!/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ava)
	) {
		res.send({ error: true })
	} else {
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection
				.insertOne({
					username: username,
					password: hashed,
					verified: false,
					ava: ava,
					iat: Date.now(),
				})
				.then(() => {
					sendVerifyMail(username)
					res.send({ error: false })
				})
		})
	}
})

router.get('/checkValid', passport.checkNotAuth, async (req, res) => {
	const username = req.query.username

	await adminCollection.findOne({ username: username }).then((data) => {
		if (data == null) {
			res.send('ok')
		} else {
			res.send('error')
		}
	})
})

router.get('/verify', passport.checkNotAuth, async (req, res) => {
	res.render('auth/verify')
})

router.get('/verified', passport.checkNotAuth, async (req, res) => {
	if (req.query.username != undefined) {
		await adminCollection
			.updateOne(
				{ username: req.query.username },
				{
					$set: {
						verified: true,
					},
				}
			)
			.then((data) => {
				req.login(req.query.username, () => {})
			})
			.then(() => {
				res.redirect('/admin')
			})
	}
})

module.exports = router
