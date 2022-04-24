const cloudinary = require('cloudinary').v2

cloudinary.config({
	cloud_name: 'dominic13',
	api_key: '956311633155226',
	api_secret: 's1gPFmoFV5PhmlOkBZGqupZ6f9k',
})

module.exports = cloudinary