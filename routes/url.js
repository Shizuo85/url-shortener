const express = require('express');
const router = express.Router();

const {
	getAllUrls,
	shortenUrl,
	redirectUrl,
	deleteUrl,
} = require('../controllers/url');

const { protect } = require('../controllers/users');

router.route("/shortenUrl").post(protect, shortenUrl)
router.route("/").get(protect, getAllUrls)
router.route("/:short").get(redirectUrl)
router.route("/:id").delete(protect, deleteUrl)

module.exports = router;
