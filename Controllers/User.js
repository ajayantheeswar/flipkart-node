const { Database } = require('../Database/mongoose');

const Order = require('../Models/Order');
const mongoose = require('mongoose');

const {razorPayInstance} = require('../razorPay');
const { v4 : uuidv4 } =require ('uuid');

const cartPopulateOption = {
    path : 'cart.items',
    populate : {
        path : 'productID',
        select : {
            "productName" : 1,
            "pricing" : 1,
            "imageURLs" : 1
        }
    }
}

const cartPopulateOptionForOrder = {
    path : 'cart.items',
    populate : {
        path : 'productID',
        select : {
            "productName" : 1,
            "pricing" : 1,
            "imageURLs" : 1,
            "catagoryName" : 1,
            "description" : 1
        }
    }
}

exports.getCart = async (req,res,next) => {

    await req.user.populate().execPopulate(cartPopulateOption)

    const cart = req.user.cart;
    if(cart) {
        res.status(200).json({"Status" : "Success" , cart : cart })
    }else{
        res.status(404).json({"Status" : "Fetching Failed"})
    }
}

exports.addToCart = async(req,res,next) => {
    try {
        const user = req.user;
        const item = req.body.cartItem;
        const ItemID = item.productID

        

        const cart = user.cart;
        const updatedCartItemIndex = cart.items.findIndex(itemC => itemC.productID.toString() === ItemID.toString())
        console.log(updatedCartItemIndex);
        if(updatedCartItemIndex >= 0){
            cart.items[updatedCartItemIndex].quantity += 1 ;
            cart.items[updatedCartItemIndex].subTotal = cart.items[updatedCartItemIndex].quantity * cart.items[updatedCartItemIndex].price
        }else{
            item.subTotal = item.quantity * item.price
            cart.items = [...user.cart.items,item];
        }
     
        const updatedCartPrice  = cart.items.reduce((sum,{subTotal}) => sum + subTotal,0)
        user.cart.items = cart.items;
        user.cart.totalPrice = updatedCartPrice;
        await user.save()
        await req.user.populate(cartPopulateOption).execPopulate()

        res.status(200).json({"Status" : "Success" , cart : user.cart })
    }
    catch(err) {
        res.status(400).json({"Status" : "Add to Cart Failed" , error : err.message})
    }
}

exports.removeFromCart = async(req,res,next) => {
    try {
        const user = req.user;
        const itemID = req.params.productID;

        const cart = user.cart;
        cart.items = cart.items.filter(item => item.productID.toString() !== itemID)
        const updatedCartPrice  = cart.items.reduce((sum,{subTotal}) => sum + subTotal,0)
        user.cart.totalPrice = updatedCartPrice;
        user.cart = cart;

        await user.save()
        await req.user.populate(cartPopulateOption).execPopulate()

        res.status(200).json({"Status" : "Success" , cart : user.cart })
    }catch(err){
        res.status(404).json({"Status" : "remoce from Cart Failed" , error : err.message})
    }
}

exports.incCart = async(req,res,next) => {
    try {
        const user = req.user;
        const itemID = req.params.productID;
        const cart = user.cart;

        const updatedCartItemIndex = cart.items.findIndex(item => item.productID.toString() === itemID)
        cart.items[updatedCartItemIndex].quantity += 1 ;
        
        cart.items[updatedCartItemIndex].subTotal = cart.items[updatedCartItemIndex].quantity * cart.items[updatedCartItemIndex].price;
        cart.totalPrice = cart.items.reduce((sum,{subTotal}) => sum + subTotal,0)

        user.cart = cart;

        await user.save()
        await req.user.populate(cartPopulateOption).execPopulate()

        res.status(200).json({"Status" : "Success" , cart : user.cart })
    }
    catch(err) {
        res.status(404).json({"Status" : "INC to Cart Failed" , error : err.message})
    }
}

exports.decCart = async(req,res,next) => {
    try {
        const user = req.user;
        const itemID = req.params.productID;
        const cart = user.cart;
        
        const updatedCartItemIndex = cart.items.findIndex(item => item.productID.toString() === itemID)
        cart.items[updatedCartItemIndex].quantity -= 1 ;

        if (!cart.items[updatedCartItemIndex].quantity > 0) {
            cart.items = cart.items.filter(item => item.productID.toString() !== itemID)
        }else{
            cart.items[updatedCartItemIndex].subTotal = cart.items[updatedCartItemIndex].quantity * cart.items[updatedCartItemIndex].price;
            
        } 
        cart.totalPrice = cart.items.reduce((sum,{subTotal}) => sum + subTotal,0)

        user.cart = cart;

        await user.save()
        await req.user.populate(cartPopulateOption).execPopulate()

        res.status(200).json({"Status" : "Success" , cart : user.cart })
    }
    catch(err) {
        res.status(404).json({"Status" : "DEC to Cart Failed" , error : err.message})
    }
}


// ORDERs

exports.getOrders = async (req,res,next) => {
    try {
        const userID = req.user.id;
        const orders = await Order.find({
            userID : mongoose.Types.ObjectId(userID)
        })
        res.status(200).json({Status : 'Success' , orders : orders})
    }catch(err) {
        res.status(404).json({"Status" : "Orders Fetch Failed" , error : err.message})
    }
}

exports.postOrder = async (req,res,next) => {
    try {
        const userID = req.user.id;
        const {deliveryDetails , paymentDetails} = req.body;
        const {address ,phone , deliveryMode } = deliveryDetails;

        await req.user.populate().execPopulate(cartPopulateOptionForOrder)

        const cart = req.user.cart;

        const delivery = {
            address : address,
            phone : phone,
            status : "APPROVED",
            deliveryDate : ''
        }

        const amount = cart.totalPrice;
        const products = cart.items;
        let order = new Order({
            userID : userID,
            products : products,
            delivery :delivery,
            amount :amount,
            deliveryMode : deliveryMode,
            paymentDetails : paymentDetails
        });

        cart.items = [];
        cart.totalPrice = 0;
        await order.save();
        await req.user.save();

        res.status(200).json({Status : 'Success' , order : order, mode : deliveryMode})
    }catch(err) {
        res.status(404).json({"Status" : "Orders Fetch Failed" , error : err.message})
    }
}

exports.createOrderRazorPay = async (req,res,next) => {
    try{
        const cart = req.user.cart;
        const amount = cart.totalPrice;
       
        const razorOrder =  await razorPayInstance.orders.create({amount : amount * 100, currency : 'INR', receipt : uuidv4() , payment_capture : true})
        res.status(200).json({Status : 'Success' ,razorOrder , mode : 'RAZOR_PAY'})    
    }catch(err) {
        res.status(404).json({"Status" : "Payment Creation  Failed" , error : err.message})
    }
}

exports.cancelOrder = async (req,res,next) => {
    try{    
        const {orderID} = req.body;
        const order = await Order.findById(mongoose.Types.ObjectId(orderID))

        if (order.deliveryMode !== 'Cash on Delivery') {
            const refund = await razorPayInstance.payments.refund(order.paymentDetails.razorpay_payment_id)
            order.paymentDetails = {
                ...order.paymentDetails,
                refund : refund
            }
        }

        order.delivery.status = "CANCELLED";
        await order.save();

        const userID = req.user.id;
        const orders = await Order.find({
            userID : mongoose.Types.ObjectId(userID)
        })
        res.status(200).json({Status : 'Success' , orders : orders})
    }catch (error) {
        res.status(404).json({"Status" : "Orders Cancel Failed" , error : error.message})
    }
}

