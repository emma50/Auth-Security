require('dotenv').config()

const express = require("express")
const bodyParser = require("body-parser")
const ejs = require("ejs")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const saltRounds = 10

const app = express()
const port = 3000

app.set('view engine', 'ejs')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("public"))

// Connection URL
const url = 'mongodb://localhost:27017/' 
const dbName = "userDB"

mongoose.connect(`${url + dbName}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true 
});

// Database Schema
const Schema = mongoose.Schema

// User Schema
const userSchema = new Schema({
    email: {
      type: String,
      required: [true, "Please check your data entry. No email specified!"]
    },
    password: {
        type: String,
        required: [true, "Please check your data entry. No password specified!"]
    }
})
  
// Model
const User = mongoose.model("User", userSchema)


app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})

app.get("/login", (req, res) => {
    res.render("login")
})

app.post("/register", (req, res) => {
    const userName = req.body.username
    const userPassword = req.body.password

    bcrypt.hash(userPassword, saltRounds, function(err, hash) {
        const newUser = new User({
            email: userName, 
            password: hash
        })
    
        newUser.save(function(err){
            if (!err) {
                res.render("secrets")
            } else {
                console.log(err)
            }
        })
    })
})

app.post("/login", (req, res) => {
    const userName = req.body.username
    const userPassword = req.body.password

    User.findOne({email: userName}, function(err, foundUser){
        if (err) {
            console.log(err)
        } else {
            if (foundUser) {
                bcrypt.compare(userPassword, foundUser.password, function(err, result){
                    if (result) {
                        res.render("secrets")
                    }
                })
            }
        }
    })
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})



