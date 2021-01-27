const express = require('express')
const Api = require('../controllers/api.js')

const router = express.Router()

router.use((req, res, next) => {
  if(req.is('json')) {
    next()
  } else {
    res.redirect('/')
  }
})

router.post('authorizeOperation', (req, res) => {
  Api.authorizeOperation(req, res)
  .catch(error => res.status(500).jsonp({ success: false, message: 'Internal server error', error }))
});

module.exports = router;
