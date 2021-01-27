const express = require('express')
const loggedIn = require('../middleware/logged-in.js')

const router = express.Router()

router.get('/', (req, res) => {
    res.render('welcome')
})

router.get('/account', loggedIn, (req, res) => {
    res.send('Conta')
})

module.exports = router;
