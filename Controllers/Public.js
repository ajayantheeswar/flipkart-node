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

exports.getProductsByCatagory = async (req,res,next) => {
    try {
        const catagoryName = req.query.catagoryName;

        console.log(req.query)

        const options = req.query.sortBy;
        let products = [];

        if(options === 'LH'){
            products = await ProductModel.find({"catagoryName" : catagoryName}).sort('pricing.currentPrice');
        }else if(options === 'HL'){
            products = await ProductModel.find({"catagoryName" : catagoryName}).sort('-pricing.currentPrice');
        }else{
            products = await ProductModel.find({"catagoryName" : catagoryName});
        }
        res.status(200).json({products : products , Message : "SUCCESS"});    

    }catch(err) {
        res.status(400).json({Message : "Fail" , err : err.message});
    }
}

exports.searchProduct = async (req,res,next) => {
    try {
        const queryString = req.query.search;
        const options = req.query.sortBy;
        let products = [];

        console.log(options)

        //const filter = { $or : [{"catagoryName" : new RegExp('^'+queryString+'$', "i")},{"productName" : new RegExp('^'+queryString+'$', "i")}] }
        
        const filter = { $or : [{"catagoryName" : {$regex : '^.*'+queryString+'.*$' , $options: 'i' }},{"productName" : {$regex : '^.*'+queryString+'.*$' , $options: 'i' }}] }

        if(options === 'LH'){
            products = await ProductModel.find(filter).sort('pricing.currentPrice');
        }else if(options === 'HL'){
            products = await ProductModel.find(filter).sort('-pricing.currentPrice');
        }else{
            products = await ProductModel.find(filter);
        }

        res.status(200).json({products : products , Message : "SUCCESS"});

    }catch(err) {
        res.status(400).json({Message : "Fail" , err : err.message});
    }
}