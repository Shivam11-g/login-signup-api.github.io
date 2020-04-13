const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://shivam11:shivam11@cluster0-rkp9u.mongodb.net/test?retryWrites=true&w=majority',
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
  userImage:{
    type: String, required: true
  }
  // add in geo location
})
 

module.exports = mongoose.model('loginData', DataSchema)
