const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//Load user model
const User = mongoose.model('users');

//this is where we'll do local strategy, serialize and deserialize
//we need username field because we're using email as our username
module.exports = function(passport) {
  passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
    //check for the user
    User.findOne({
      email:email
    }).then(user => {
      if(!user) {
        return done(null, false, {message: 'No User Found'});
      }

      //check the password if there is a user
      //the user in user.password is coming from the .then(user)
      //if it finds a user, it has an unencrypted password
      //bcrypt will compare the unencrypted password to the hashed password
      bcrypt.compare(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          return done(null, user);
        } else {
          return done(null, false, {message: 'Passowrd Incorrect'});
        }
      });
    });
  }));


  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    //findById is fine because we're using mongoose. We may have to use something else otherwise
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
