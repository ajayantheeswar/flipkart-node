const mongoose = require("mongoose");
const { model } = require("./User");
const Schema = mongoose.Schema;

const productSchema = new Schema({
	productName : {
        type : String
    },
    catagoryName : {
        type : String
    } 
    ,
    pricing : {
        currentPrice : Number
    },
    imageURLs : [String],
    description : {
        type : String,
        default : "NA"
    },
    highlights : [{
        type :String
    }],
    techincalSpecification : [{
        title : String,
        list : [{
            key : String,
            value : String
        }]
    }],
    reviews : [{
        userName : String,
        title : String,
        content : String,
        rating : String
    }]
});

module.exports.ProductModel = mongoose.model('Product',productSchema)
module.exports.ProductSchema = productSchema;