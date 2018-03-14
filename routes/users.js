const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//Load User Model
require('../models/User');
const User = mongoose.model('users');

//user1 login Route
router.get('/login', (req, res) => {
  res.render('users/login');
});

//user register Route
router.get('/register', (req, res) => {
  res.render('users/register');
});

// Login Form POST
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/ideas',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

//Register Form Post (create a User)
router.post('/register', (req, res) => {
  let errors = [];

  if (req.body.password != req.body.password2) {
    errors.push({text: 'Passwords do not match'});
  }

  if (req.body.password.length < 6) {
    errors.push({text: 'Password must be at least 6 characters'});
  }

  //will keep stuff prefilled if errors come up
  if (errors.length > 0) {
    res.render('users/register', {
      errors: errors,
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      password2: req.body.password2
    });
  } else {
    User.findOne({email: req.body.email})
    .then(user => {
      if (user){
        req.flash('error_msg', 'Email already registered');
        res.redirect('/users/register');
      } else {
        const newUser = new User ({
          name: req.body.name,
          email: req.body.email,
          password: req.body.password
        });

        //generate a salt for the password
        //first parameter indicates how long you want the salted password to be
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err2, hashedPassword) => {
            if(err) throw err;
            newUser.password = hashedPassword;
            newUser.save()
              .then(user1 => {
                req.flash('success_msg', 'You are now registered and can log in');
                res.redirect('/users/login');
              })
              .catch(err3 => {
                console.log(err3);
                return;
              });
          });
        });
      }
    });
  }
});

module.exports = router;
