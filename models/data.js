const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()

mongoose.connect(
  process.env.DB_CONNECT,
 {
   useNewUrlParser: true,  useUnifiedTopology: true
 })
// var const = mongoose.Connection

const DataSchema = mongoose.Schema({

 // _id: mongoose.Schema.Types.ObjectId,
  
  Name:{
    type: String, required: true
  },
  MobileNo:{
    type: Number, required: true
  },
  Password:{
    type: String, required: true
  },
  UserImage:{
    type: String, required: true
  }
  // add in geo location
})
 

module.exports = mongoose.model('loginData', DataSchema)
