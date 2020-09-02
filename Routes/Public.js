const express = require('express');
const multer = require('multer');
const PublicController = require('../Controllers/Public');

const router = express.Router();

router.get('/get-product/:productID',PublicController.getProduct)

exports.router = router;