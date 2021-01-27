const express = require('express')
const { ensureLoggedIn } = require('connect-ensure-login')

const router = express.Router()

router.get('/', (req, res) => {
  res.render('welcome')
})

router.get('/account', ensureLoggedIn('/users/login'), (req, res) => {
  res.send('Conta')
  // TODO: Esta rota vai permitir alterar os dados da conta do utilizador, mas é praticamente só isso
})

module.exports = router;
