const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdminUserSchema = new Schema({
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
	products: [
        { type: Schema.Types.ObjectId , ref: 'Product' }
    ],
    authType : String
});

module.exports = mongoose.model('AdminUser',AdminUserSchema)