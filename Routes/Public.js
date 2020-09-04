const express = require('express');
const multer = require('multer');
const PublicController = require('../Controllers/Public');

const router = express.Router();

router.get('/get-product/:productID',PublicController.getProduct)

router.get('/get-catagory',PublicController.getProductsByCatagory);

router.get('/search',PublicController.searchProduct)

exports.router = router;