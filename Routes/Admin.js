const express = require('express');
const multer = require('multer');
const AdminController = require('../Controllers/Admin');

const router = express.Router();
const upload = multer();

router.post('/add-product',upload.array('imageFiles'),AdminController.addProduct);


router.post('/deliver-order')

exports.router = router;