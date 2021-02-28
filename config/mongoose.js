const mongoose = require("mongoose")

// Connection URL
const url = 'mongodb://localhost:27017/' 
const dbName = "userDB"

mongoose.connect(`${url + dbName}`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true 
})

module.exports = mongoose;