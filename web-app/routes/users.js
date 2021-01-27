const express = require('express')
const passport = require('passport')
const nanoid = require('nanoid')

const Users = require('../controllers/users.js')

const router = express.Router()

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
    if(await Users.exists({ email: req.body.email })) {
      req.flash('alert-wrong-email', { type: 'danger', icon: 'fas fa-exclamation-triangle', text: 'Um utilizador com este endereço de email já existe!' });

      return res.render('register');
    }

    try {
      ({ email, fullname, password, unixUsername } = req.body);

      // TODO: Possibly validate input?

      await Users.insert({ email, fullname, unixUsername }, password);

      req.flash('alert-registered-successfully', { type: 'success', icon: 'fas fa-exclamation-triangle', text: 'Utilizador registado com sucesso!' });
      
      return res.redirect('/users/login')
    } catch(error) {
      req.flash('alert-register-failed', { type: 'danger', icon: 'fas fa-exclamation-triangle', text: 'Ocorreu um erro ao registar o utilizador!' });

      return res.render('register');
    }
});

router.get('/login', (req, res) => {
  res.render('login')
});

router.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/users/login', failureFlash: 'Username ou password incorretos!',
    successReturnToOrRedirect: '/account'
  })
);

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
