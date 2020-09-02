require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Database Import 
const {Database} = require('./Database/mongoose');
const AdminRouter = require('./Routes/Admin');
const PublicRouter = require('./Routes/Public');
const AuthRouter = require('./Routes/Auth');
const UserRouter = require('./Routes/User');

//Middleware
const AuthMiddleware = require('./Middlewares/Auth');

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/admin',AdminRouter.router);
app.use('/auth',AuthRouter.router);
app.use('/public',PublicRouter.router);

app.use('/user',AuthMiddleware.userAuthMiddleware,UserRouter.router)


app.listen(3002);