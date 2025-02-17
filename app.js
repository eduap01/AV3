var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');



var app = express();
require('./database');
require('./passport/local-auth');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var studiesRouter = require('./routes/studies');
var subjectsRouter = require('./routes/subjects');
var softwaresRouter = require('./routes/softwares');


app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//app.use(express.static(path.join(__dirname, 'public')));
app.use("/public", express.static(path.resolve(__dirname + '/public')));
app.use(session({
  secret: 'mysecretsession',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/subjects', subjectsRouter);
app.use('/studies', studiesRouter);
app.use('/softwares', softwaresRouter);

app.use((req, res, next) => {
  app.locals.signinMessage = req.flash('signinMessage');
  app.locals.user = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', subjectsRouter);
app.use('/', studiesRouter);
app.use('/', softwaresRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
