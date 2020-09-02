const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const catagorySchema = new Schema({
    name : String,
    filters = [String]
});

module.exports = mongoose.model('Catagory',catagorySchema)