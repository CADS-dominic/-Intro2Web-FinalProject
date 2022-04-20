var express = require('express')
const passport = require('passport')
var router = express.Router()
var { adminCollection, userCollection } = require('../../db')

const itemPerPage = 5

router.get('/', passport.checkAuth, async function (req, res) {
	let userList = []

	await adminCollection.find({}).forEach((doc) => {
		if (userList.length < itemPerPage) userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		if (userList.length < itemPerPage) userList.push({ role: 'User', ...doc })
	})

	res.render('admin/account', {
		username: req.user.username,
		ava: req.user.ava,
		userList: userList,
	})
})

router.post('/pagin', async (req, res) => {
	let userList = []
	await adminCollection.find({}).forEach((doc) => {
		userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		userList.push({ role: 'User', ...doc })
	})

	res.send({ totalPages: Math.ceil(userList.length / itemPerPage) })
})

router.post('/next', async (req, res) => {
	let userList = []
	await adminCollection.find({}).forEach((doc) => {
		userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		userList.push({ role: 'User', ...doc })
	})

	let currentPage = req.body.currentPage
	if (currentPage < Math.ceil(userList.length / itemPerPage)) {
		let result = []
		for (let i = 0; i < userList.length; i++) {
			if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
				result.push(userList[i])
			}
		}
		res.send({ currentPage: parseInt(currentPage) + 1, userList: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/prev', async (req, res) => {
	let userList = []
	await adminCollection.find({}).forEach((doc) => {
		userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		userList.push({ role: 'User', ...doc })
	})

	let prevPage = req.body.currentPage - 1
	if (prevPage > 0) {
		let result = []
		for (let i = 0; i < userList.length; i++) {
			if (i >= (prevPage - 1) * itemPerPage && i <= (prevPage - 1) * itemPerPage + itemPerPage - 1) {
				result.push(userList[i])
			}
		}
		console.log(result)
		res.send({ currentPage: parseInt(prevPage), userList: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/goto', async (req, res) => {
	let userList = []
	await adminCollection.find({}).forEach((doc) => {
		userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		userList.push({ role: 'User', ...doc })
	})

	let currentPage = req.body.page - 1
	let result = []
	for (let i = 0; i < userList.length; i++) {
		if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
			result.push(userList[i])
		}
	}
	res.send({ currentPage: parseInt(currentPage) + 1, userList: result })
})

router.get('/ban', passport.checkAuth, (req, res) => {
	res.render('account/ban')
})

router.get('/unban', passport.checkAuth, (req, res) => {
	res.render('account/unban')
})

module.exports = router
