const express = require('express');
const Auth = require('../Controllers/Auth');

const router = express.Router();

router.post('/user/signin',Auth.signInUser);
router.post('/user/signup',Auth.signUpUser);

router.post('/admin/signup',Auth.signUpAdminUser);
router.post('/admin/signin',Auth.signInAdminUser);

router.post('/verify-otp',Auth.verifyUserOTP)

exports.router = router;