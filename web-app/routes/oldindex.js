const express = require('express');
const router = express.Router();

const User = require('../controllers/user');

router.get('/', (req, res) => {
  res.render('homepage')
})

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('regist');
});

router.post('/codeVerification', (req, res) => {
  const code = req.body.code;

  console.log(code)

  // Confirar que o codigo inserido é igual ao gerado

  //Testar com 1234
  if (code == "1234") {
    res.render('authorization', { myMessage: "Autorizado com sucesso" });
  }
  else {
    res.render('authorization', { myMessage: "Autorização negada. Codigo errado" });
  }
})

router.post('/login', (req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  console.log(mail + ' ' + password)

  User.get(mail)
    .then(data => { if (data.password == password) { res.redirect('http://localhost:3000/myHomePage?mail=' + mail) } else { res.render('login') } })
    .catch(e => res.render('login'))

    .catch(e => res.render('error', { myMessage: "Couldn't find user" }))

})

router.post('/register', (req, res) => {
  let mail = req.body.mail;
  let name = req.body.name;
  let password = req.body.password;

  User.insert({ mail, name, password })
    .then(data => {
      res.status(201)
    })
    .catch(e => console.log("Couldn't insert user"))

  res.redirect('http://localhost:3000/')

})

module.exports = router;
