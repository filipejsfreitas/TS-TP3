require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const mongoose = require('mongoose');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const { nanoid } = require('nanoid');
const flash = require('req-flash');
const moment = require('moment');

const User = require('./models/user.js');

const indexRouter = require('./routes/index.js');
const apiRouter = require('./routes/api.js');
const authRouter = require('./routes/auth.js');

const app = express();

mongoose.connect(`mongodb://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`,
    { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 5000 });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error...'));
mongoose.connection.once('open', function () {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser())

app.use(session({
    genid: _ => nanoid(),
    store: new FileStore(),
    secret: process.env.APP_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: moment().add(1, 'days').toDate()
    }
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(flash({
    locals: 'flashData'
}));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/auth', authRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    if(req.accepts('html')) {
        res.render('error', { error: err });
    } else {
        res.jsonp({ error: err });
    }
});

module.exports = app;
