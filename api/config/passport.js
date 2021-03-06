const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const sequelize = require('sequelize');


// Load User model
const User = require('../models/User');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user

      User.findOne({ where: { email: email } })
      // User.findOne({
      //   email: email
      // })
      .then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );
  
passport.serializeUser((user, done)  =>{
  done(null, user.id);
});

  passport.deserializeUser((id, done, user, err) =>{

    User.findAll({WHERE: {id: user}}, id)
      .then((user) => {
        return done(null, user);
      }).catch(error => {
          return done(error, null)
      });

    });


};
