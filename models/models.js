const mongoose = require('../config/mongoose')
const passportLocalMongoose = require('../config/passportLocalMongoose')
const findOrCreate = require('../config/findOrCreate')

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

module.exports = User;