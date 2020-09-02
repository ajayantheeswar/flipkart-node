const { Database } = require('../Database/mongoose');
const {ProductModel} = require('../Models/Product');
const {bucket} = require('../firebase');

const http = require('http');
const mongoose = require('mongoose');

exports.getProduct = async (req,res,next) => {
    try {
        const productID = mongoose.Types.ObjectId(req.params.productID);
        console.log(productID);
        const product = await ProductModel.findById(productID);

        if(product){
            res.status(200).json({product : product._doc , Message : "SUCCESS"});    
        }else{
            throw new Error('Product Not Found !');
        }

        
    }
    catch (err){
        res.status(400).json({Message : "Fail" , err : err.message});
    }
}