var express = require('express')
const passport = require('passport')
var router = express.Router()
var { productCollection } = require('../../db')
const cloudinary = require('../../configs/cloudinary')
const { ObjectId } = require('mongodb')

const itemPerPage = 5

router.get('/', passport.checkAuth, async function (req, res) {
	let products = []
	const { input, sort } = req.query
	await productCollection.find({}).forEach((doc) => {
		if (input == undefined || input == '') {
			products.push({ ...doc, ava: doc.ava[0] })
		} else {
			if (
				doc.name.toLowerCase().includes(input.toLowerCase()) ||
				doc.brand.toLowerCase().includes(input.toLowerCase()) ||
				doc.category.toLowerCase().includes(input.toLowerCase())
			)
				products.push({ ...doc, ava: doc.ava[0] })
		}
	})

	if (sort == 'username' || sort == undefined) {
		products.sort((a, b) => {
			if (a.name < b.name) return -1
			if (a.name > b.name) return 1
			return 0
		})
	} else {
		products.sort((a, b) => {
			if (parseInt(a.price) < parseInt(b.price)) return -1
			if (parseInt(a.price) > parseInt(b.price)) return 1
			return 0
		})
	}

	let result = []
	for (let i = 0; i < itemPerPage && products[i] != null; i++) {
		result.push(products[i])
	}

	if (input == undefined) {
		res.render('admin/product', {
			username: req.user.username,
			ava: req.user.ava,
			products: result,
		})
	} else {
		res.send({ products: result })
	}
})

router.post('/pagin', async (req, res) => {
	const input = req.body.input

	let products = []
	if (input == undefined) {
		await productCollection.find({}).forEach((doc) => {
			products.push(doc)
		})
	} else {
		await productCollection.find({}).forEach((doc) => {
			if (
				doc.name.toLowerCase().includes(input.toLowerCase()) ||
				doc.brand.toLowerCase().includes(input.toLowerCase()) ||
				doc.category.toLowerCase().includes(input.toLowerCase())
			)
				products.push(doc)
		})
	}

	res.send({ totalPages: Math.ceil(products.length / itemPerPage) })
})

router.post('/next', async (req, res) => {
	const { input, sort } = req.body

	let products = []
	if (input == undefined) {
		await productCollection.find({}).forEach((doc) => {
			console.log(doc)
			products.push({ ...doc, ava: doc.ava[0] })
		})
	} else {
		await productCollection.find({}).forEach((doc) => {
			if (
				doc.name.toLowerCase().includes(input.toLowerCase()) ||
				doc.brand.toLowerCase().includes(input.toLowerCase()) ||
				doc.category.toLowerCase().includes(input.toLowerCase())
			)
				products.push({ ...doc, ava: doc.ava[0] })
		})
	}

	if (sort == 'username' || sort == undefined) {
		products.sort((a, b) => {
			if (a.name < b.name) return -1
			if (a.name > b.name) return 1
			return 0
		})
	} else {
		products.sort((a, b) => {
			if (parseInt(a.price) < parseInt(b.price)) return -1
			if (parseInt(a.price) > parseInt(b.price)) return 1
			return 0
		})
	}

	let currentPage = req.body.currentPage
	if (currentPage < Math.ceil(products.length / itemPerPage)) {
		let result = []
		for (let i = 0; i < products.length; i++) {
			if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
				result.push(products[i])
			}
		}
		res.send({ currentPage: parseInt(currentPage) + 1, products: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/prev', async (req, res) => {
	const { input, sort } = req.body

	let products = []
	if (input == undefined) {
		await productCollection.find({}).forEach((doc) => {
			products.push({ ...doc, ava: doc.ava[0] })
		})
	} else {
		await productCollection.find({}).forEach((doc) => {
			if (
				doc.name.toLowerCase().includes(input.toLowerCase()) ||
				doc.brand.toLowerCase().includes(input.toLowerCase()) ||
				doc.category.toLowerCase().includes(input.toLowerCase())
			)
				products.push({ ...doc, ava: doc.ava[0] })
		})
	}

	if (sort == 'username' || sort == undefined) {
		products.sort((a, b) => {
			if (a.name < b.name) return -1
			if (a.name > b.name) return 1
			return 0
		})
	} else {
		products.sort((a, b) => {
			if (parseInt(a.price) < parseInt(b.price)) return -1
			if (parseInt(a.price) > parseInt(b.price)) return 1
			return 0
		})
	}

	let prevPage = req.body.currentPage - 1
	if (prevPage > 0) {
		let result = []
		for (let i = 0; i < products.length; i++) {
			if (i >= (prevPage - 1) * itemPerPage && i <= (prevPage - 1) * itemPerPage + itemPerPage - 1) {
				result.push(products[i])
			}
		}
		res.send({ currentPage: parseInt(prevPage), products: result })
	} else {
		res.status(400).send({ error: true })
	}
})

router.post('/goto', async (req, res) => {
	const { input, sort } = req.body

	let products = []
	if (input == undefined) {
		await productCollection.find({}).forEach((doc) => {
			products.push({ ...doc, ava: doc.ava[0] })
		})
	} else {
		await productCollection.find({}).forEach((doc) => {
			if (
				doc.name.toLowerCase().includes(input.toLowerCase()) ||
				doc.brand.toLowerCase().includes(input.toLowerCase()) ||
				doc.category.toLowerCase().includes(input.toLowerCase())
			)
				products.push({ ...doc, ava: doc.ava[0] })
		})
	}

	if (sort == 'username' || sort == undefined) {
		products.sort((a, b) => {
			if (a.name < b.name) return -1
			if (a.name > b.name) return 1
			return 0
		})
	} else {
		products.sort((a, b) => {
			if (parseInt(a.price) < parseInt(b.price)) return -1
			if (parseInt(a.price) > parseInt(b.price)) return 1
			return 0
		})
	}

	let currentPage = req.body.page - 1
	let result = []
	for (let i = 0; i < products.length; i++) {
		if (i >= currentPage * itemPerPage && i <= currentPage * itemPerPage + itemPerPage - 1) {
			result.push(products[i])
		}
	}
	res.send({ currentPage: parseInt(currentPage) + 1, products: result })
})

router.get('/details', passport.checkAuth, async (req, res) => {
	let products = []
	await productCollection.find({}).forEach((doc) => {
		products.push(doc)
	})

	const result = products.find((product) => product._id == req.query.id)

	res.render('product/details', {
		product: result,
		username: req.user.username,
		ava: req.user.ava,
	})
})

router.get('/add', passport.checkAuth, (req, res) => {
	res.render('product/add', { username: req.user.username, ava: req.user.ava })
})

router.post('/add', async (req, res) => {
	const { name, price, brand, category, status, ava, description } = req.body

	if (name == '' || price == '' || brand == '' || category == '' || ava.length == 0 || description == '') {
		res.send({ error: true })
	} else {
		let temp = []
		for (let img of ava) {
			const response = await cloudinary.uploader.upload(img)
			temp.push(response.url)
		}
		await productCollection.insertOne({
			name: name,
			ava: temp,
			brand: brand,
			category: category,
			price: price,
			status: status,
			description: description,
			comment: [],
			iat: Date.now(),
		})
		res.send({ error: false })
	}
})

router.get('/update', passport.checkAuth, (req, res) => {
	res.render('product/update', { username: req.user.username, ava: req.user.ava })
})

router.post('/update', async (req, res) => {
	const { id, name, price, brand, category, status, ava, description } = req.body

	if (id == '' || name == '' || price == '' || brand == '' || category == '' || ava.length == 0 || description == '') {
		res.send({ error: true })
	} else {
		let temp = []
		for (let img of ava) {
			const response = await cloudinary.uploader.upload(img)
			temp.push(response.url)
		}
		await productCollection.updateOne(
			{ _id: ObjectId(id) },
			{
				$set: {
					name: name,
					brand: brand,
					category: category,
					price: price,
					status: status,
					description: description,
				},
				$push: {
					ava: {
						$each: temp,
					},
				},
			}
		)
		res.send({ error: false })
	}
})

router.post('/remove', async (req, res) => {
	const public_id = req.body.url.split('/').at(-1),
		id = req.body.id
	try {
		// await cloudinary.api.delete_resources(public_id, (err, res) => {
		// 	console.log(err, res)
		// })
		await productCollection.updateOne(
			{ _id: ObjectId(id) },
			{
				$pull: {
					ava: req.body.url,
				},
			}
		)
		res.send({ error: false })
	} catch (e) {
		res.send({ error: true })
	}
})

module.exports = router
