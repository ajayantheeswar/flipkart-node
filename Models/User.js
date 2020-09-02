const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: {
        type : String,
        required : true
    },
	email: {
        type : String,
        required : true,
        unique : true
    },
	password: {
        type : String,
        required : true
    },
	cart: {
		items: [
			{
				productID: { type: Schema.Types.ObjectId , ref: 'Product' },
                quantity: { type: Number, required: true },
                price : {type : Number , required : true},
                subTotal : Number
			},
        ],
        totalPrice : Number
    
    },
    authType : String
    
});

module.exports = mongoose.model('User',userSchema)