const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new mongoose.Schema({
    email: String,
    fullname: String,
    password: String,
    unixUsername: String
});

userSchema.plugin(passportLocalMongoose, { usernameField: 'email', passwordField: 'password' })

module.exports = mongoose.model('user', userSchema)
