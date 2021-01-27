const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    fullname: String,
    password: String,
    unixUsername: String
});

module.exports = mongoose.model('user', userSchema)
