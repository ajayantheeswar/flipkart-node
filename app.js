require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Database Import 
const {Database} = require('./Database/mongoose');

const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.listen(3002);