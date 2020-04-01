
const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// const appController = require('./controllers/appController')
const appRoutes = require('./routes/api')

//
const app = express()

//connect to mongoDB
mongoose.connect('mongodb://localhost/ninjaGo')
mongoose.Promise = global.Promise

//middleware
app.use(bodyParser.json())

//set us template engine
app.set('view engine', 'ejs')

//static files
app.use('/css', express.static('style'));

//error middleware
app.use(function(err, req, res, next){
  res.status(422).send({error: err})
})

//
appRoutes(app)


//listen for req
app.listen(process.env.port || 4000, function(){
  console.log('now listening...');
})
