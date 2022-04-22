var express = require('express')
const passport = require('passport')
var router = express.Router()
var { adminCollection, userCollection } = require('../../db')

const itemPerPage = 5

router.get('/', passport.checkAuth, async function (req, res) {
	let userList = []
	const { input, sort } = req.query
	await adminCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			userList.push({ role: 'Admin', ...doc })
		} else {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) userList.push({ role: 'Admin', ...doc })
		}
	})
	await userCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			userList.push({ role: 'User', username: doc.email, ...doc })
		} else {
			if (doc.name.toLowerCase().includes(input.toLowerCase()) || doc.email.toLowerCase().includes(input.toLowerCase()))
				userList.push({ role: 'User', username: doc.email, ...doc })
		}
	})

	if (sort == 'username' || sort == undefined) {
		userList.sort((a, b) => {
			if (a.username < b.username) return -1
			if (a.username > b.username) return 1
			return 0
		})
	} else {
		userList.sort((a, b) => {
			if (a.iat < b.iat) return -1
			if (a.iat > b.iat) return 1
			return 0
		})
	}

	let result = []
	for (let i = 0; i < itemPerPage && userList[i] != null; i++) {
		result.push(userList[i])
	}

	if (input == undefined) {
		res.render('admin/account', {
			username: req.user.username,
			ava: req.user.ava,
			userList: result,
		})
	} else {
		res.send({ users: result })
	}
})

router.post('/pagin', async (req, res) => {
	const input = req.body.input

	let userList = []
	if (input == undefined) {
		await adminCollection.find({}).forEach((doc) => {
			userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			userList.push({ role: 'User', username: doc.email, ...doc })
		})
	} else {
		await adminCollection.find({}).forEach((doc) => {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			if (doc.name.toLowerCase().includes(input.toLowerCase()) || doc.email.toLowerCase().includes(input.toLowerCase()))
				userList.push({ role: 'User', username: doc.email, ...doc })
		})
	}

	res.send({ totalPages: Math.ceil(userList.length / itemPerPage) })
})

router.post('/next', async (req, res) => {
	const { input, sort } = req.body

	let userList = []
	if (input == '') {
		await adminCollection.find({}).forEach((doc) => {
			userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			userList.push({ role: 'User', username: doc.email, ...doc })
		})
	} else {
		await adminCollection.find({}).forEach((doc) => {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			if (doc.name.toLowerCase().includes(input.toLowerCase()) || doc.email.toLowerCase().includes(input.toLowerCase()))
				userList.push({ role: 'User', username: doc.email, ...doc })
		})
	}

	if (sort == 'username') {
		userList.sort((a, b) => {
			if (a.username < b.username) return -1
			if (a.username > b.username) return 1
			return 0
		})
	} else {
		userList.sort((a, b) => {
			if (a.iat < b.iat) return -1
			if (a.iat > b.iat) return 1
			return 0
		})
	}

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
	const { input, sort } = req.body

	let userList = []
	if (input == '') {
		await adminCollection.find({}).forEach((doc) => {
			userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			userList.push({ role: 'User', username: doc.email, ...doc })
		})
	} else {
		await adminCollection.find({}).forEach((doc) => {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			if (doc.name.toLowerCase().includes(input.toLowerCase()) || doc.email.toLowerCase().includes(input.toLowerCase()))
				userList.push({ role: 'User', username: doc.email, ...doc })
		})
	}

	if (sort == 'username') {
		userList.sort((a, b) => {
			if (a.username < b.username) return -1
			if (a.username > b.username) return 1
			return 0
		})
	} else {
		userList.sort((a, b) => {
			if (a.iat < b.iat) return -1
			if (a.iat > b.iat) return 1
			return 0
		})
	}

	let prevPage = req.body.currentPage - 1
	if (prevPage > 0) {
		let result = []
		for (let i = 0; i < userList.length; i++) {
			if (i >= (prevPage - 1) * itemPerPage && i <= (prevPage - 1) * itemPerPage + itemPerPage - 1) {
				result.push(userList[i])
			}
		}
		res.send({ currentPage: parseInt(prevPage), userList: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/goto', async (req, res) => {
	const { input, sort } = req.body

	let userList = []
	if (input == '') {
		await adminCollection.find({}).forEach((doc) => {
			userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			userList.push({ role: 'User', username: doc.email, ...doc })
		})
	} else {
		await adminCollection.find({}).forEach((doc) => {
			if (doc.username.toLowerCase().includes(input.toLowerCase())) userList.push({ role: 'Admin', ...doc })
		})
		await userCollection.find({}).forEach((doc) => {
			if (doc.name.toLowerCase().includes(input.toLowerCase()) || doc.email.toLowerCase().includes(input.toLowerCase()))
				userList.push({ role: 'User', username: doc.email, ...doc })
		})
	}

	if (sort == 'username') {
		userList.sort((a, b) => {
			if (a.username < b.username) return -1
			if (a.username > b.username) return 1
			return 0
		})
	} else {
		userList.sort((a, b) => {
			if (a.iat < b.iat) return -1
			if (a.iat > b.iat) return 1
			return 0
		})
	}

	let currentPage = req.body.page - 1
	let result = []
	for (let i = 0; i < userList.length; i++) {
		if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
			result.push(userList[i])
		}
	}
	res.send({ currentPage: parseInt(currentPage) + 1, userList: result })
})

router.get('/details', passport.checkAuth, async (req, res) => {
	let userList = []
	await adminCollection.find({}).forEach((doc) => {
		userList.push({ role: 'Admin', ...doc })
	})
	await userCollection.find({}).forEach((doc) => {
		userList.push({ role: 'User', username: doc.email, ...doc })
	})

	const result = userList.find((user) => user.username == req.query.username)

	res.render('account/details', {
		user: result,
		username: req.user.username,
		ava: req.user.ava,
		isAdmin: result.role == 'Admin' ? true : false,
	})
})

router.get('/ban', passport.checkAuth, async (req, res) => {
	if (req.query.username == undefined) {
		let userList = []
		await userCollection.find({ ban: false }).forEach((doc) => {
			userList.push({ url: `/account/ban?username=${doc.email}`, ...doc })
		})
		res.render('account/ban', { username: req.user.username, ava: req.user.ava, userList: userList })
	} else {
		await userCollection.updateOne(
			{ email: req.query.username },
			{
				$set: {
					ban: true,
				},
			}
		)
		res.redirect('/account/ban')
	}
})

router.get('/unban', passport.checkAuth, async (req, res) => {
	if (req.query.username == undefined) {
		let userList = []
		await userCollection.find({ ban: true }).forEach((doc) => {
			userList.push({ url: `/account/unban?username=${doc.email}`, ...doc })
		})
		res.render('account/unban', { username: req.user.username, ava: req.user.ava, userList: userList })
	} else {
		await userCollection.updateOne(
			{ email: req.query.username },
			{
				$set: {
					ban: false,
				},
			}
		)
		res.redirect('/account/unban')
	}
})

module.exports = router
