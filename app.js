
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')

// const appController = require('./controllers/appController')
const appRoutes = require('./routes/api')
const privateRoutes = require('./routes/privateRoutes')

//
const app = express()

// app.use(morgan('dev'))


app.use('/uploads', express.static('uploads'))

//middleware
app.use(express.json())
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false}))

app.use((err, req, res, next)=>{
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization")
  if(req.method=== 'OPTIONs'){
      res.header('Access-Control-Allow-Methods', 'PUT,POST,DELETE,PATCH')
      return res.status(200).json({})
  }

  next()
})

//set us template engine
app.set('view engine', 'ejs')

//static files
app.use('/css', express.static('style'));


//appRoutes(app);
app.use('/', appRoutes)
app.use('/api', privateRoutes)   


app.use((req, res, next)=>{
  const err= new Error('not found')
  err.status = 404
  next(err)
})

//error middleware
app.use(function(err, req, res, next){
  res.status(err.ststus || 500).json({
    error: {
    message: err.message
  }
})
})

//

//listen for req
app.listen(process.env.PORT || 4000, function(){
  console.log('now listening...');
})
