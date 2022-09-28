const express = require('express');
const router = express.Router();

const {
	getAllUrls,
	shortenUrl,
	redirectUrl,
	deleteUrl,
} = require('../controllers/url');

const { protect } = require('../controllers/users');

router.route("/shortenUrl").post(shortenUrl)
router.route("/").get(getAllUrls)
router.route("/:short").get(redirectUrl)
router.route("/:id").delete(deleteUrl)

module.exports = router;
