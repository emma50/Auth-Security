require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const session = require('express-session')
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")
const GoogleStrategy = require('passport-google-oauth20').Strategy
const findOrCreate = require('mongoose-findorcreate')

const app = express()
const port = 3000

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(session({
  secret: 'Thisisnowmylittlesecret',
  resave: false,
  saveUninitialized: false
}))
// Use passport
app.use(passport.initialize())
app.use(passport.session())

// Connection URL
const url = 'mongodb://localhost:27017/' 
const dbName = "userDB"

mongoose.connect(`${url + dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true 
});

// Database Schema
const Schema = mongoose.Schema

// User Schema
const userSchema = new Schema({
    email: String,
    password: String,
    googleId: String,
    secret: String 
})

// Use passport local mongoose
userSchema.plugin(passportLocalMongoose)
userSchema.plugin(findOrCreate)
  
// Model
const User = mongoose.model("User", userSchema)

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
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/secrets",
    userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ googleId: profile.id }, function (err, user) {
      return cb(err, user)
    })
  }
))

app.get("/", (req, res) => {
    res.render("home")
})

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

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

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

