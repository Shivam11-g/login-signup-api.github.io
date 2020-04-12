
// const bcrypt = require('Bcrypt')
const express = require('express')
const router = express.Router()
const Data = require('../models/data')

var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: true })

module.exports = function(router){

  router.get("/users", function(req, res, next) {
    Data.find()
    .select(' Name MobileNo Password _id')
    .exec()
    .then(users =>{
      const responce = {
          count: users.length,
          products: users.map(d=>{
           return{
              name: d.Name,
                MobileNo: d.MobileNo,
                Password: d.password,
                _id: d._id,
                req:{
                  type: 'GET',
                  url: 'http://127.0.0.56:4000/'+ d._id
                }
           }
          })
      }
      res.status(200).json(responce)
    })
  });

  router.get('/signup', function(req, res, next){

      res.status(200).render('signUpPage')
  })

  router.get('/login',function(req, res, next){
      res.status(200).render('loginPage')

  })

  router.get("/:userId", function(req, res, next) {
    const id= req.params.userId
    Data.findById(id).exec().then(data =>{
      console.log(data);
      if (data) {        
      res.status(200).json(data);
      }
      else{
        res.status(404).json({message: 'invalid entry'})
      }
      
    }).catch(err =>{
      console.log(err);
      res.status(500).json({ error: err });
      
    })
  });

  router.post('/login', urlencodedParser, function(req, res, next){
    Data.find({Name: req.body.Name })
    .exec()
    .then( user =>{
      console.log(user[0]);
      if (user.length <1) {
      //  res.status(201).render('userNotExist')
      res.status(500).json({
        message: 'user does not exist'
      })
      }
      // console.log(req.body.Password, user[0].Password);
      var buf1 = Buffer.from(req.body.Password);
      var buf2 = Buffer.from(user[0].Password);
      var x = Buffer.compare(buf1, buf2 )
      console.log(x);

     if (!x) {
      // res.status(201).render('profilePage', {
      //   data: user[0]
      // })
      res.status(200).json({
        data: user[0]
      });
    }
    else{
      res.status(201).json({message: 'invalid password'})
    }


    })

  })

  router.get('/homepage',function(req, res, next){
      res.status(200).render('homePage')
  })

  router.get('/',function(req, res, next){
      res.status(200).render('homePage')
  })

  router.post('/signup', urlencodedParser, function(req, res, next){

    // const signupData = new data({
    //   Name: req.body.Name,
    //   MobileNo: req.body.MobileNo,
    //   Password: req.body.Password
    // })
    
    // signupData.save().then(result =>{
    //   console.log(result);
      
    // }).catch(err=> console.log(err))

    Data.find({Name: req.body.Name }).exec().then(user =>{
      if (user.length >=1) {
          //res.status(201).render('userExist')
          res.status(200).json({message: 'user already exist'})
      //  return res.send("User exist")

      }
      else {
        // const hash = bcrypt.hashSync(req.body.Password, 10);
        // console.log(req.body.Password);
        // req.body.Password = hash;
        Data.create(req.body).then(function(data){
          console.log(req.body);
            console.log(data);
          // res.send({
          //     data
          // })
          // res.status(201).render('profilePage', {
          //   data: data
          // })

          res.status(200).json({
            message: 'Signup Sucessful',
            user: {
              name: data.Name,
              mobileNo: data.MobileNo,
              password: data.Password,
              _id: data._id,
              req:{
                type: 'GET',
                url: 'http://127.0.0.56:4000/' + data._id
              }
            }
          })
        }).catch(err => res.status(500).json({error: err}))
      }
    })

  })

  // get a list of ninjas from the DB
  router.get('/ninjas', function(req,res, next){
   res.status(200).send({
     type: 'GET'
   })

  })

  // add a new ninja to the DB
  router.post('/ninjas',urlencodedParser, function(req,res, next){
    Data.create(req.body).then(function(data){
      res.status(201).send(req.body)
    }).catch(next)

  })

  //update a ninja in DB
  router.put('/user/:userId', function(req,res, next){
    const id = req.params.userId
    const updateOps = {}
    for (const ops of req.body) {
      updateOps[ops.propName] = ops.value      
    }
    // data must be in this format => [{
// 	"propName": "Name",
// 	"value": "123shivamgggg"
// }]
    Data.update({ _id: id }, { $set: updateOps })
      .exec()
      .then(result => {
        res.status(200).json({ result: result });
      })
      .catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err, message: "input data must be in array" });
      });
    
  })


  // delete a ninja from the DB
  router.delete('/user/:userId', function(req,res, next){
    const id= req.params.userId
    Data.remove({_id: id}).exec().then(result=>{
      res.status(200).json(result)
    }).catch(err =>{
      console.log(err)
      res.status(500).json({error: err})
      
    })
  })
}
