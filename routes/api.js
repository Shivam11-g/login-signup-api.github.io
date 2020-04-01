
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()
const Data = require('../models/data')

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: true })

module.exports = function(router){


  router.get('/signup', function(req, res, next){

      res.render('signUpPage')
  })

  router.get('/login',function(req, res, next){
      res.render('loginPage')

  })

  router.post('/login', urlencodedParser, function(req, res, next){
    Data.find({Name: req.body.Name })
    .exec()
    .then( user =>{
      console.log(user[0]);
      if (user.length <1) {
        res.render('userNotExist')
      //  return
      }
      console.log(req.body.Password, user[0].Password);
      bcrypt.compare(req.body.Password, user[0].Password, function(err, result) {
    if (result) {
      console.log(result);
      res.render('profilePage', {data: user[0]})
    }
});

    })

  })

  router.get('/homepage',function(req, res, next){
      res.render('homePage')
  })

  router.get('/',function(req, res, next){
      res.render('homePage')
  })

  router.post('/signup', urlencodedParser, function(req, res, next){
    Data.find({Name: req.body.Name }).exec().then(user =>{
      if (user.length >=1) {
          res.render('userExist')

      //  return res.send("User exist")

      }
      else {
        const hash = bcrypt.hashSync(req.body.Password, 10);
        console.log(req.body.Password);
        req.body.Password = hash;
        Data.create(req.body).then(function(data){
          console.log(req.body);
            console.log(data);
          // res.send({
          //     data
          // })
          res.render('profilePage',{data: data})
        }).catch(next)
      }
    })

  })

  // get a list of ninjas from the DB
  router.get('/ninjas', function(req,res, next){
   res.send({type:'GET'})

  })

  // add a new ninja to the DB
  router.post('/ninjas',urlencodedParser, function(req,res, next){
    Data.create(req.body).then(function(data){
      res.send(req.body)
    }).catch(next)

  })

  //update a ninja in DB
  router.put('/ninjas/:id', function(req,res, next){
   res.send({type:'PUT'})

  })


  // delete a ninja from the DB
  router.delete('/ninjas/:id', function(req,res, next){
    Data.findByName({mobileNo: req.params.id}).then(function(ninja){
      res.send({ninja})
    })
   res.send({type:'DELETE'})

  })
}
