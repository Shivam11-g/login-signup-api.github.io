const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://shivam11:shivam11@cluster0-rkp9u.mongodb.net/test?retryWrites=true&w=majority',
 {
   useNewUrlParser: true,  useUnifiedTopology: true
 })
// var const = mongoose.Connection

const DataSchema = mongoose.Schema({
  Name:{
    type:String
  },
  MobileNo:{
    type:Number
  },
  Password:{
    type: String
  }
  // add in geo location
})
 

module.exports = mongoose.model('loginData', DataSchema)
