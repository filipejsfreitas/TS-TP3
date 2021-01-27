const jwt = require('jsonwebtoken')

module.exports = async function (req, res, next) {
  if(!req.cookies.token) {
    return res.redirect('/users/login')
  }

  if(await jwt.verify(req.cookies.token, process.env.JWT_KEY)) {
    return next()
  } else {
    return res.redirect('/users/login')
  }
}
