const mongoose = require('mongoose');
const Product = require('../Models/Product');


mongoose.connect(process.env.MONGO_HOST, { useNewUrlParser: true ,useUnifiedTopology: true});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('connected', async () => {
    console.log("Mongo Connecton Established")
});

exports.Database = mongoose.connection;
