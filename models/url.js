const mongoose = require('mongoose');
const validator = require('validator');

const UrlSchema = new mongoose.Schema(
	{
		fullUrl: {
			type: String,
			required: [true, 'must provide URL'],
			trim: true,
			validate: {
				validator: (value) =>
					validator.isURL(value, {
						protocols: ['http', 'https', 'ftp'],
						require_tld: true,
						require_protocol: true,
					}),
				message: 'Must be a Valid URL',
			},
		},
		shortUrl : String,
		createdBy: {
			type: mongoose.Schema.ObjectId,
			ref: 'User',
			select: false,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model('Url', UrlSchema);
