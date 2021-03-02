const passport = require("passport")
const GoogleStrategy = require('./googleStrategy')
const findOrCreate = require('./findOrCreate')
const User = require('../models/models')

passport.use(User.createStrategy())

passport.serializeUser(function(user, done) {
  done(null, user.id)
})
  
passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user)
  })
})

// Configure Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user)
    })
  }
))

module.exports = passport