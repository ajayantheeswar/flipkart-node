const mongoose = require('mongoose');


mongoose.connect(process.env.MONGO_HOST, { useNewUrlParser: true ,useUnifiedTopology: true});

mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error:'));
mongoose.connection.on('connected', () => {
    console.log("Mongo Connecton Established")
});

exports.Database = mongoose.connection;
