const Url = require('../models/url');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const shortid = require("shortid")

console.log(shortid.generate())
const getAllUrls = catchAsync(async (req, res, next) => {
	const urls = await Url.find({ createdBy: req.user.id });
	if (!urls) {
		return next(new AppError('You have no pending urls', 404));
	}
	res.status(200).json({ urls });
});

const shortenUrl = catchAsync(async (req, res) => {
	req.body.createdBy = req.user.id;
	const url = await Url.create({
		fullUrl: req.body.fullUrl,
		createdBy: req.user.id,
		shortUrl: shortid.generate()
	});
	res.status(201).json({ url });
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
