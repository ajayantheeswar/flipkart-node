const express = require('express');
const Auth = require('../Controllers/Auth');

const router = express.Router();

router.post('/user/signin',Auth.signInUser);
router.post('/user/signup',Auth.signUpUser);

exports.router = router;