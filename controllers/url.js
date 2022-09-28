const Url = require('../models/url');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/users');
const AppError = require('../utils/appError');
const shortid = require("shorturl")

const getAllUrls = catchAsync(async (req, res, next) => {
	const urls = await Url.find({ createdBy: req.user.id });
	if (!urls) {
		return next(new AppError('You have no pending urls', 404));
	}
	res.status(200).json({ tasks });
});

const shortenUrl = catchAsync(async (req, res) => {
	req.body.createdBy = req.user.id;
	const task = await Task.create({
		fullUrl: req.body.fullUrl,
		createdBy: req.user.id,
		shortUrl: shortid.generate(req.body.fullUrl)
	});
	res.status(201).json({ task });
});

const redirectUrl = catchAsync( async (req, res, next)=> {
	const url = await Url.findOne({shortUrl: req.params.short})
	if (!url) {
		return next(new AppError(`no url shortened as: ${req.params.short}`, 404));
	}
	res.direct(url.fullUrl)
})

const deleteUrl = catchAsync(async (req, res, next) => {
	const deleteUrl = await Url.findOneAndDelete({
		_id: req.params.id,
		createdBy: req.user.id,
	});

	if (!deleteUrl) {
		return next(new AppError(`no url with id : ${req.params.id}`, 404));
	}
	res.status(200).json({ deleteUrl });
});

module.exports = {
	getAllUrls,
	shortenUrl,
	redirectUrl,
	deleteUrl
};
