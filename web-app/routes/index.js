const express = require('express');
const router = express.Router();

const User = require('../controllers/user');
const nodemailer = require('nodemailer');

router.get('/', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('regist');
});

router.get('/myHomePage', (req, res) => {
  let user = req.query.mail

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'tseguranca2021@gmail.com',
      pass: 'tecnologia2021',
      port: 587,
      secure: true
    }
  });

  const mailOptions = {
    from: 'tseguranca2021@gmail.com',
    to: user,    // enviar para o individuo autenticado
    subject: 'Lifuse authorization code',
    html: '<h5>Code: </h5>'   // colocar aqui o codigo gerado 
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });

  res.render('homePage');
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
  const mail = req.body.mail;
  const password = req.body.password;
  const name = req.body.name;
  
  console.log(mail + ' ' + password)

  let user = {
    name: name,
    mail: mail,
    password: password
  }


  User.insert(user)
    .then(data => {
      res.status(201)
    })

    .catch(e => console.log("Couldn't insert user"))

  res.redirect('http://localhost:3000/')

})

module.exports = router;
