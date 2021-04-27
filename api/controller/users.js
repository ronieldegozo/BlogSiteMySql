
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const passport = require('passport');


exports.userHome = (req, res) => 
    res.render('welcome', {
    pageTitle: 'Home',
    path: '/'
})

exports.getUserRegister = (req, res) => 
    res.render('register', {
    pageTitle: 'Register'
})


exports.userDashboard =  (req, res) =>
    res.render('dashboard', {
    user: req.user,
    pageTitle: 'Dashboard'
})


exports.userRegister = (req,res)=>{
  const {name ,nickname ,email, password, password2} = req.body;
  let errors = [];
  

  //check required fileds
  if(!name || !nickname || !email || !password, !password2 ){
      errors.push({ msg: 'Please fill in all fields'});
  }
  
  //check password match
  if(password != password2 ){
      errors.push({ msg: 'Passwords do not match'});
  }

  //check pass length

  if(password.length <6){
      errors.push({ msg: 'Password should be atleast 6 character'});
  }

  if(errors.length >0){
      res.render('register', {
          errors, name, nickname,email, password, password2, pageTitle: 'Register'
      });
  }else{
      //validation pass
      User.findOne({email: email})
          .then(user =>{
                  const newUser = new User({
                      name,
                      nickname,
                      email,
                      password
                  });
                  //hashpassword
                  bcrypt.genSalt(10, (err, salt)=>{
                      bcrypt.hash(newUser.password, salt, (err,hash) => {
                          if(err) throw err;

                          //setpassword to hash
                          newUser.password = hash;
                          //save the user
                          newUser.save()
                              .then(user => {
                                  req.flash('success_msg','You are now Registered and can Log in'); //flash message for success user registation
                                  res.redirect('/');
                              })
                              .catch(err => console.log(err));
                      })
                  })
                  console.log(user);
              
          })
          .catch((err)=>{
              console.log(err);
          });
  }
}, 

exports.userLogin = (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/',
      failureFlash: true,

    })(req, res, next);
  }

exports.userLogout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/');
  }