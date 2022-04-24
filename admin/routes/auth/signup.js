var express = require('express')
var router = express.Router()
var bcrypt = require('bcrypt')
var { adminCollection } = require('../../db')
var nodemailer = require('nodemailer')
var passport = require('passport')
const cloudinary = require('../../configs/cloudinary')

async function sendVerifyMail(username, url) {
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
		subject: 'Verify your mail',
		html: `<a href='${url}/signup/verified?username=${username}'>Click this link to verify your mail</a>`,
	})
}

router.get('/', passport.checkNotAuth, function (req, res) {
	res.render('auth/signup')
})

router.post('/', passport.checkNotAuth, async (req, res, next) => {
	const { username, password, repassword, ava } = req.body
	const url = req.protocol + '://' + req.get('host')

	if (
		username == '' ||
		password == '' ||
		repassword != password ||
		repassword == '' ||
		!/\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(ava)
	) {
		res.send({ error: true })
	} else {
		const cloudinaryResponse = await cloudinary.uploader.upload(ava, { upload_preset: 'avatars', public_id: username })
		await bcrypt.hash(password, parseInt(process.env.SALT)).then((hashed) => {
			adminCollection
				.insertOne({
					username: username,
					password: hashed,
					verified: false,
					ava: cloudinaryResponse.url,
					iat: Date.now(),
				})
				.then(() => {
					sendVerifyMail(username, url)
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
