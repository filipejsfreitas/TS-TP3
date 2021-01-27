const User = require('../models/user.js')

module.exports.getByEmail = (email) => {
  return User.findOne({ email }).exec()
}

module.exports.exists = userData => {
  return User.exists(userData)
}

module.exports.insert = async userData => {
  let user = new User(userData);
  return user.save();
}
