require('dotenv').config();

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var path = require('path');



// Create a new Express application.
var app = express();

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Use application-level middleware for common functionality, including
// logging, parsing, and session handling.
app.use(require('morgan')('combined'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'keyboard cat', resave: true, saveUninitialized: true }));

app.use(express.static("./views"));


// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());

require('./controllers/passport.js')


// Define routes.
app.get('/',
  function(req, res){
    res.sendFile(path.join(__dirname, "views/login.html"), { user: req.user });

  });

app.get('/login/facebook',
  passport.authenticate('facebook'));

app.get('/return', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.sendFile(path.join(__dirname, "views/dashboard.html"));
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
  function(req, res){
    res.sendFile(path.join(__dirname, "views/dashboard.html"), { user: req.user });
  });

app.listen(process.env['PORT'] || 8080);
