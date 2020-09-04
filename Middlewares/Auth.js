const User = require('../Models/User');
const AdminUser = require('../Models/AdminUser');
const JWT = require('../Utils/JWT');
const mongoose = require('mongoose');

exports.userAuthMiddleware = async (req,res,next) => {
    
    const encodedtoken = req.header('authorization');
    const type = req.header('type');
    
    try {
        let user ;
        if(type === 'Google') {
            const payload = await JWT.verifyGoogleToken(encodedtoken);
            user = await User.findOne({
                    email : payload.email
            });
        }else{
            const userId = await JWT.tokenDecode(encodedtoken);
            user = await User.findById(mongoose.Types.ObjectId(userId));
        }

        if(!user) {
            throw new Error("Auth Fail")
        }
        req.user = user;

        next();
    } 
    catch(err) {
        res.status(403).json({error : err.message + ' po'});
    }
}


exports.adminUserAuthMiddleware = async (req,res,next) => {
    
    const encodedtoken = req.header('authorization');
    const type = req.header('type');
    
    try {
        let user ;
        if(type === 'Google') {
            const payload = await JWT.verifyGoogleToken(encodedtoken);
            user = await AdminUser.findOne({
                    email : payload.email
            });
        }else{
            const userId = await JWT.tokenDecode(encodedtoken);
            user = await AdminUser.findById(mongoose.Types.ObjectId(userId));
        }

        if(!user) {
            throw new Error("Auth Fail")
        }
        req.user = user;

        next();
    } 
    catch(err) {
        res.status(403).json({error : err.message + ' po'});
    }
}