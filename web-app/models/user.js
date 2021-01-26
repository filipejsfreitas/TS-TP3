var mongoose = require('mongoose')

var user = new mongoose.Schema({
    name: String,
    mail: String,
    password: String
});

module.exports = mongoose.model('user', user)