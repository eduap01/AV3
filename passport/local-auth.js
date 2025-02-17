const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/user');

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

//no hay sign-up

passport.use('local-signin', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, email, password, done) => {
  var user = new User();
   user = await user.findEmail( email);
  if(!user) {
    return done(null, false, req.flash('signinMessage', 'No User Found'));
  }
  //if(!user.comparePassword(password)) {
    //return done(null, false, req.flash('signinMessage', 'Incorrect Password'));
  //}
  return done(null, user);
}));
