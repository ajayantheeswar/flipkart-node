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

router.get('/get-orders',userController.getOrders);
router.post('/post-order',userController.postOrder);

router.post('/create-razor-order' ,userController.createOrderRazorPay)

router.post('/cancel-order',userController.cancelOrder);



exports.router = router