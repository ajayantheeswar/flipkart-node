const express = require('express');
const bodyParser = require('body-parser');
const User = require('../Models/User');
const UserAdmin = require('../Models/AdminUser');

const {sendOTP} = require('../Utils/Email');

const JWT = require('../Utils/JWT');
const e = require('express');

exports.signUpUser = async (req,res,next) => {

    const {authType} = req.body.credientials;

    let user = {};

    try {
        let googleToken;
        if(authType === 'Google') {
            const {tokenId} = req.body.credientials;
            googleToken = tokenId;
            const payload = await JWT.verifyGoogleToken(tokenId);
            const {email,name} = payload;
            user.name = name;
            user.email = email;
            user.authType = 'Google';
        }else{
            const {Name,Email,Password} = req.body.credientials;
            const encodedPassword = JWT.passwordEncode(Password);
            user.name = Name;
            user.email = Email;
            user.authType = 'EMP';
            user.password = encodedPassword;
        }
   
        const vUser = await User.create({
            name : user.name,
            email : user.email,
            password : user.password,
            authType : user.authType,
            cart : []
        });
        
        
        const token = vUser.id;
        const email = vUser.email;
        const name = vUser.name;
        const encodedToken = authType === 'Google' ? googleToken : JWT.tokenEncode(token);

        res.status(201).json({"Token" : encodedToken,'user' : {
            name,email
        }, isAdmin : false ,authType : authType});
    }
    catch(error) {
        console.log(error)
        if(error.name === 'SequelizeUniqueConstraintError')
            res.status(400).json({"Auth Status" : "FAIL" ,"error" : "The Account Already Exists"});
        else{
            res.status(400).json({"Auth Status" : "FAIL" ,"error" : error.message});
        }
    }
}

exports.signInUser = async (req,res,next) => {

    const {authType} = req.body.credientials;
    let user = {};

    try {
        let googleToken;
        if(authType === 'Google') {
            const {tokenId} = req.body.credientials;
            tokenIdValue = tokenId;
            const payload = await JWT.verifyGoogleToken(tokenId);
            user.email = payload.email;
        }
        else{
            const {Email,Password} = req.body.credientials;
            const encodedPassword = JWT.passwordEncode(Password);
            user.email = Email;
            user.encodedPassword = encodedPassword;
        }
        const vUser = await User.findOne({
            email : user.email
        })
        
        if(!vUser){
            // The Email Does not Present
            throw new Error("The e-mail does not Exixts");
        }

        if(authType === 'EMP'){
            // Verify the password if auth type is EMP
            const hashedPassword = vUser.password;
            if(hashedPassword !== user.encodedPassword) {
                res.status(403).json({"Auth Status" : "FAIL" ,"error" : "credientials does not Match"});
                return
            }
        }

        const token = vUser.id;
        const email = vUser.email;
        const name = vUser.name;
        const encodedToken = authType === 'Google' ? tokenIdValue : JWT.tokenEncode(token);

        if(vUser.twoFactorAuthentication) {
            const OTP = await generateOPT()
            vUser.OTP =  OTP
            await Promise.all([vUser.save(),sendOTP(vUser.email,`The OTP is ${OTP.code}`)])
            res.status(202).json({isOTP : true});
        }else{
            res.status(202).json({"Token" : encodedToken,user : {
                name,email
            },isAdmin : false ,authType : authType});
        }
       
    }
    catch(error) {
        console.log(error)
        res.status(400).json({"Auth Status" : "FAIL" ,"error" : error.message});
    }
}

exports.signUpAdminUser = async (req,res,next) => {

    const {authType} = req.body.credientials;

    let user = {};

    try {
        let googleToken;
        if(authType === 'Google') {
            const {tokenId} = req.body.credientials;
            googleToken = tokenId;
            const payload = await JWT.verifyGoogleToken(tokenId);
            const {email,name} = payload;
            user.name = name;
            user.email = email;
            user.authType = 'Google';
        }else{
            const {Name,Email,Password} = req.body.credientials;
            const encodedPassword = JWT.passwordEncode(Password);
            user.name = Name;
            user.email = Email;
            user.authType = 'EMP';
            user.password = encodedPassword;
        }
   
        const vUser = await UserAdmin.create({
            name : user.name,
            email : user.email,
            password : user.password,
            authType : user.authType,
            cart : []
        });
        
        
        const token = vUser.id;
        const email = vUser.email;
        const name = vUser.name;
        const encodedToken = authType === 'Google' ? googleToken : JWT.tokenEncode(token);

        res.status(201).json({"Token" : encodedToken,'user' : {
            name,email
        },isAdmin : true ,authType : authType});
    }
    catch(error) {
        console.log(error)
        if(error.name === 'SequelizeUniqueConstraintError')
            res.status(400).json({"Auth Status" : "FAIL" ,"error" : "The Account Already Exists"});
        else{
            res.status(400).json({"Auth Status" : "FAIL" ,"error" : error.message});
        }
    }
}

exports.signInAdminUser = async (req,res,next) => {

    const {authType} = req.body.credientials;
    let user = {};

    try {
        let googleToken;
        if(authType === 'Google') {
            const {tokenId} = req.body.credientials;
            tokenIdValue = tokenId;
            const payload = await JWT.verifyGoogleToken(tokenId);
            user.email = payload.email;
        }
        else{
            const {Email,Password} = req.body.credientials;
            const encodedPassword = JWT.passwordEncode(Password);
            user.email = Email;
            user.encodedPassword = encodedPassword;
        }
        const vUser = await UserAdmin.findOne({
            email : user.email
        })
        
        if(!vUser){
            // The Email Does not Present
            throw new Error("The e-mail does not Exixts");
        }

        if(authType === 'EMP'){
            // Verify the password if auth type is EMP
            const hashedPassword = vUser.password;
            if(hashedPassword !== user.encodedPassword) {
                res.status(403).json({"Auth Status" : "FAIL" ,"error" : "credientials does not Match"});
                return
            }
        }

        const token = vUser.id;
        const email = vUser.email;
        const name = vUser.name;
        const encodedToken = authType === 'Google' ? tokenIdValue : JWT.tokenEncode(token);

        res.status(202).json({"Token" : encodedToken,user : {
            name,email
        },isAdmin : true ,authType : authType});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({"Auth Status" : "FAIL" ,"error" : error.message});
    }
}


// 2

const generateOPT = async () => {
    const code = (Math.random() * 100000).toFixed(0)
    const exp = new Date().getTime() + (1*60*60*1000)
    return {
        code : code,
        exp : exp,
        attempt : 3
    }
}

exports.verifyUserOTP = async (req,res,next) => {
    try{
        const {OTP,email} = req.body;
        const user = await User.findOne({email : email})

        if(!user) {
            res.status(400).json({"Auth Status" : "FAIL" ,"error" : "INVALID USER"});
            return;
        }

        console.log(typeof OTP)
        if(user.OTP.code === +OTP){
                const token = user.id;
            const name = user.name;
            const encodedToken = user.authType === 'Google' ? tokenIdValue : JWT.tokenEncode(token);

            res.status(202).json({"Token" : encodedToken,user : {
                name,email
            },isAdmin : false ,authType : user.authType});

            user.OTP = null;
            await user.save();
            return
        }

        if(user.OTP.attempt > 0){
            user.OTP.attempt = user.OTP.attempt-1 ;
            await user.save()
            return res.status(400).json({"Auth Status" : "FAIL" ,"error" : "INVALID OTP" , Message : `Invalid OTP. ${user.OTP.attempt} Attempts Remaining` });
        }else {
            user.OTP = null;
            await user.save()
            return res.status(400).json({"Auth Status" : "FAIL" ,"error" : "Exceeded TRY Again" ,  exceeded : true});
        }

    }catch(err) {
        res.status(400).json({"Auth Status" : "FAIL" ,"error" : err.message});
    }
    
}