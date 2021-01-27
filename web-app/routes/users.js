const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const Users = require('../controllers/users.js')

const router = express.Router()

const SALT_ROUNDS = 8;

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
    if(await Users.exists({ email: req.body.email })) {
      return res.render('register', {
        flashMessages: [
          { type: 'danger', message: 'Um utilizador com este endereço de email já existe!' }
        ]
      });
    }

    try {
      ({ email, fullname, password, unixUsername } = req.body);

      try {
        password = await bcrypt.hash(password, SALT_ROUNDS);
      } catch(error) {
        // Failed to encrypt password!
        return res.render('register', {
          flashMessages: [
            { type: 'danger', message: 'Ocorreu um erro ao registar o utilizador!' }
          ]
        });
      }

      await Users.insert({ email, fullname, password, unixUsername });

      res.redirect('/users/login?registered=true')
    } catch(error) {
      return res.render('register', {
        flashMessages: [
          { type: 'danger', message: 'Ocorreu um erro ao registar o utilizador!' }
        ]
      });
    }
});

router.get('/login', (req, res) => {
  if(req.query.registered) {
    return res.render('login', {
      flashMessages: [
        { type: 'success', message: 'Utilizador registado com sucesso!' }
      ]
    });
  }

  res.render('login')
})

router.post('/login', async (req, res) => {
  ({ email, password } = req.body);

  let user = await Users.getByEmail(email);

  let dbPassword = null;
  if(user) {
    dbPassword = user.password;
  }

  // The user with the specified email might not exist at this point.
  // Regardless, to prevent a timing attack (that distinguishes between wrong username or wrong password),
  // we will now attempt to compare the password to a random bcrypt hash

  let passwordCorrect;
  try {
    passwordCorrect = await bcrypt.compare(password, dbPassword);
  } catch(error) {
    passwordCorrect = false;
  }

  if(user && passwordCorrect) {
    let token;

    try {
      token = await jwt.sign({ email }, process.env.JWT_KEY);
    } catch(error) {
      res.status(500)
         .render('login', {
            flashMessages: [
              { type: 'danger', message: 'Ocorreu um erro ao autenticar o utilizador!' }
            ]
          });
    }

    res.status(200)
       .cookie('token', token)
       .redirect('/account');
  } else {
    res.render('login', {
      flashMessages: [
        { type: 'danger', message: 'Username/Password errados!' }
      ]
    });
  }
})

module.exports = router;
