const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://admin:123@sneakerjeeps.vk6bp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
client.connect();

module.exports = client;
