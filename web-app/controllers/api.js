const nodemailer = require('nodemailer')
const util = require('util')
const { customAlphabet } = require('nanoid')

const app = require('../app.js')
const User = require('../models/user.js')
const RequestCache = require('../providers/request-cache.js')

const nanoid = customAlphabet('0123456789', 6)

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    port: process.env.EMAIL_PORT,
    secure: true
  }
});

const requestCache = new RequestCache();
module.exports.requestCache = requestCache;

module.exports.authorizeOperation = async (req, res) => {
  // Find the owner's email by his Unix username
  let owner;
  try {
    owner = await User.findOne({ unixUsername: req.body.owner }).exec();
  } catch (error) {
    return res.status(500).jsonp({ success: false, message: `Could not find user with Unix username ${req.body.owner}`, error: null })
  }

  // Find the user's email by his Unix username
  let user;
  try {
    user = await User.findOne({ unixUsername: req.body.user }).exec();
  } catch(error) {
    return res.status(500).jsonp({ success: false, message: `Could not find user with Unix username ${req.body.user}`, error: null})
  }

  // Generate a code
  const generatedCode = nanoid()

  // Render an HTML template to send as email content
  const render = util.promisify(res.render)
  const html = await render('email-template', { generatedCode, file: req.body.file, user: { fullname: user.fullname, email: user.email, unixUsername: user.unixUsername } })

  // Attempt to send the email
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: owner.email,
      subject: 'Libfuse Authorization Code',
      html 
    });
  } catch(error) {
    return res.status(500).jsonp({ success: false, message: 'Error sending code email!', error })
  }

  // Fail the request in 30 seconds
  const timeoutId = setTimeout(() => {
    if(requestCache.doesRequestExist(generatedCode)) {
      requestCache.deleteRequest(generatedCode)
      res.status(200).jsonp({ success: false, message: 'A code was not introduced in time to fulfill this request!' })
    }
  }, 30000)

  // Email sent. Now we wait for the response to be posted to another URL
  // but we must store this access attempt into the RequestCache
  requestCache.addRequest(generatedCode, () => {
    // If the user successfully entered the code, send the response to the server
    res.status(200).jsonp({ success: true, message: 'The user is authorized to access this resource!' })
    
    clearTimeout(timeoutId);
  })

  return true;
}
