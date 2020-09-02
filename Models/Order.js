const mongoose = require("mongoose");
const {ProductSchema} = require('./Product');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userID : mongoose.Types.ObjectId,
    products : [
        {
            productID: ProductSchema,
            quantity: { type: Number, required: true },
            price : {type : Number , required : true},
            subTotal : Number
        },
    ],
    delivery : {
        address : String,
        phone : Number,
        status : String,
        deliveryDate : String
    },
    amount : Number,
    deliveryMode : String
});

module.exports = mongoose.model('Order',orderSchema)