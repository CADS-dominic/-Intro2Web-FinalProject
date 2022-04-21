const { MongoClient, ServerApiVersion } = require('mongodb')

const uri = process.env.MONGO_URI
const client = new MongoClient(uri, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1,
})
client.connect()

const adminCollection = client.db('ver2').collection('admin')
const userCollection = client.db('ver2').collection('users')
const productCollection = client.db('ver2').collection('products')
const orderCollection = client.db('ver2').collection('orders')

module.exports = { adminCollection, userCollection, productCollection, orderCollection }
