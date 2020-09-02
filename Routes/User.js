const express = require('express');
const router = express.Router()

const userController = require('../Controllers/User');

// CART - Routes

router.get('/get-cart',userController.getCart);

router.post('/add-to-cart',userController.addToCart);
router.post('/remove-from-cart/:productID',userController.removeFromCart)

router.post('/inc-cart/:productID',userController.incCart);
router.post('/dec-cart/:productID',userController.decCart); 

// Orders - Routes

router.get('/get-orders');
router.post('/post-order',userController.postOrder);

router.post('/cancel-order');



exports.router = router