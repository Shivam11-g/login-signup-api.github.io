const mongoose = require('mongoose')
const Schema = mongoose.Schema

const DataSchema = new Schema({
  Name:{
    type:String
  },
  MobileNo:{
    type:String
  },
  Password:{
    type: String
  }
  // add in geo location
})

const LoginData = mongoose.model('loginData', DataSchema)

module.exports = LoginData
