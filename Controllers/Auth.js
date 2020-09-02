const express = require('express');
const bodyParser = require('body-parser');
const User = require('../Models/User');

const JWT = require('../Utils/JWT');

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
        }});
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

        res.status(202).json({"Token" : encodedToken,user : {
            name,email
        }});
    }
    catch(error) {
        console.log(error)
        res.status(400).json({"Auth Status" : "FAIL" ,"error" : error.message});
    }
}