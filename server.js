require('dotenv').config();

var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var path = require('path');



// Create a new Express application.
var app = express();



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

require('./controllers/FBpassport.js')
require('./controllers/Gpassport.js')


// Define routes.
app.get('/',
  function(req, res){
    res.sendFile(path.join(__dirname, "views/login.html"), { user: req.user });

  });


  // Define routes.
app.get('/dashboard',
  function(req, res){
     res.sendFile(path.join(__dirname, "views/dashboard.html"), { user: req.user });

});

// FB ROUTES

app.get('/login/facebook',
  passport.authenticate('facebook'));

  // FB CALLBACK ROUTE

  app.get('/auth/facebook/callback', 
    passport.authenticate('facebook',  { failureRedirect: '/login' }),
      function(req, res) {
  // Successful authentication, redirect home.
         res.redirect('/dashboard')

  });


// GOOGLE ROUTE

app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile'] }));

// GOOGLE CALLBACK ROUTE

  app.get('/auth/google/callback', 
    passport.authenticate('google', { failureRedirect: '/login' }),
      function(req, res) {
    // Successful authentication, redirect home.
         res.redirect('/dashboard')
  });


// SAVED LOGIN DEFAULT TO ROUTE

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),
    function(req, res){
      res.sendFile(path.join(__dirname, "views/dashboard.html"), { user: req.user });
  });


 


app.listen(process.env['PORT'] || 8080);
