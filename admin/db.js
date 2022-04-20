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

module.exports = { adminCollection, userCollection }
