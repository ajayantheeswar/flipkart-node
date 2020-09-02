const { Database } = require('../Database/mongoose');
const {ProductModel} = require('../Models/Product');
const {bucket} = require('../firebase');



const http = require('http');


exports.addProduct = async (req,res,next) => {
    try {
        const {productName,
               catagoryName,
               description,
               price,
               highlights,
               techincalSpecification} = req.body;

        let techSpec = JSON.parse(techincalSpecification);
        let highlightsJ = JSON.parse(highlights)
        const imageFiles = req.files;
        const imageURLS = await Promise.all(imageFiles.map(image => imageUpload(image)));
        
        const product = new ProductModel({
            productName : productName,
            catagoryName : catagoryName,
            description : description,
            pricing : {
                currentPrice : price
            },
            imageURLs : imageURLS,
            highlights : highlightsJ,
            techincalSpecification : techSpec 
        });
        await product.save();
        res.json({Message : "Success", product : product.get('productName') })
    }
    catch(err) {
        console.log(err)
        res.status(500).json({message : 'FAIL' , error : err})
    }
}


const imageUpload = async (file) => new Promise( (resolve,reject) => {

    try {
        const {originalname,buffer} = file;

        const blob = bucket.file(originalname);
        const blobSteam = blob.createWriteStream({
            resumable : false
        })
            .on('finish', () => {
                
                const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${blob.name}?alt=media`;   
                resolve(publicUrl)
            })

            .on('error', () => {
                reject(`Unable to upload image, something went wrong`)
            })

            .end(buffer);
        }
    catch(err) {
        reject(err.message)
    }
    

} ) 