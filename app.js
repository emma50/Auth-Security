require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const session = require('express-session')
const User = require('./models/models')
const passport = require("./config/passport")

const app = express()
const port = 3000

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
// Use passport
app.use(passport.initialize())
app.use(passport.session())

app.get("/", (req, res) => res.render("home"))

// Authenticate request
app.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }))
 
app.get(`/auth/google/secrets`, 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    // Explicitly save the session before redirecting!
    req.session.save(() => {
      // Successful authentication, redirect to secrets.
      res.redirect('/secrets')
    })
})

app.get("/register", (req, res) => res.render("register"))

app.get("/login", (req, res) => res.render("login"))

app.get("/secrets", (req, res) => {
  // Access all secrets in database with value
  User.find({"secret": {$ne: null}}, function(err, foundUsers){
    if (err) {
      console.log(err)
    } else {
      if (foundUsers) {
        res.render("secrets", {usersWithSecrets: foundUsers})
      }
    }
  })
})

app.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit")
  } else {
    res.render("login")
  }
})

app.post("/register", (req, res) => {
  const userName = req.body.username
  const userPassword = req.body.password

  User.register({username: userName}, userPassword, function(err, user) {
    if (err) {
      res.redirect("/register")
    } else {
      passport.authenticate('local')(req, res, function(){
        // Explicitly save the session before redirecting!
        req.session.save(() => {
          // Successful authentication, redirect to secrets.
          res.redirect('/secrets')
        })
      })
    }
  })
})

app.post("/login", (req, res) => {
  const userName = req.body.username
  const userPassword = req.body.password

  const user = new User({
    email: userName,
    password: userPassword
  })

  req.login(user, function(err){
    if (err) {
      console.log(err)
    } else {
      passport.authenticate('local')(req, res, function(){
        // Explicitly save the session before redirecting!
        req.session.save(() => {
          // Successful authentication, redirect home.
          res.redirect('/secrets')
        })
      })
    }
  })
})

app.post("/submit", (req, res) => {
  const submittedSecret = req.body.secret
  
  // Passport saves the user data in session
  User.findById({_id: req.user.id}, function(err, foundUser){
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        foundUser.secret = submittedSecret
        foundUser.save(() => {
          res.redirect("/secrets")
        })
      }
    }
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

// Google OAuth client ID - CLIENT_ID
// Google OAuth client secret - CLIENT_SECRET
