const express = require('express')
const Api = require('../controllers/api.js')
const { ensureLoggedIn, ensureLoggedOut } = require('connect-ensure-login')

const router = express.Router()

router.get('/', ensureLoggedOut('/account'), (req, res) => {
  res.render('welcome')
})

router.get('/authorizeOperation', (req, res) => {
  if(req.query.code) {
    if(Api.requestCache.doesRequestExist(req.query.code)) {
      Api.requestCache.processRequest(req.query.code);

      req.flash('alert-code-valid', { type: 'success', icon: 'fa fa-exclamation-circle', text: 'A operação foi autorizada com sucesso!' })
    } else {
      req.flash('alert-code-invalid', { type: 'danger', icon: 'fa fa-exclamation-circle', text: 'O código inserido não é válido!' })
    }
  }

  return res.render('code-input')
})

router.get('/account', ensureLoggedIn('/auth/login'), (req, res) => {
  ({ fullname, email, unixUsername } = req.user)

  res.render('account', { user: { fullname, email, unixUsername }})
})

module.exports = router;
