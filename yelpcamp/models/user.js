const { required } = require('joi');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema;
//Creating User Schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
})
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema);