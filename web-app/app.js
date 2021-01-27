require('dotenv').config();

const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

const RequestCache = require('./providers/request-cache.js');

const indexRouter = require('./routes/index.js');
const apiRouter = require('./routes/api.js');
const usersRouter = require('./routes/users.js');

const app = express();

app.requestCache = new RequestCache();

mongoose.connect(`mongodb://${process.env.MONGODB_IP}:${process.env.MONGODB_PORT}/${process.env.MONGODB_DB}`,
    { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('error', console.error.bind(console, 'MongoDB connection error...'));
mongoose.connection.once('open', function () {
    console.log("Conexão ao MongoDB realizada com sucesso...")
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/users', usersRouter);

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
