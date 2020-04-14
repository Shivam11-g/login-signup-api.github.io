
// const bcrypt = require('Bcrypt')
const express = require('express')
const multer = require('multer')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const router = express.Router()

const joi = require('@hapi/joi')

const Data = require('../models/data')

const {signupValidation, loginValidation} = require('../validation')

// const bodyParser = require('body-parser')
// const urlencodedParser = bodyParser.urlencoded({ extended: true })






const imageStorage = multer.diskStorage({
  destination: function (req, file ,cb ) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, req.body.Name +"."+ file.originalname)
  }
})

const fileFilter = (req, file, cb)=>{

  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true)
  }
  else{
    cb(null, false)
  }
}

const upload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
  
})



router.get("/users", function (req, res, next) {
  Data.find()
    .select(' Name MobileNo Password UserImage _id')
    .exec()
    .then(users => {
      const responce = {
        count: users.length,
        products: users.map(d => {
          return {
            Name: d.Name,
            MobileNo: d.MobileNo,
            Password: d.password,
            UserImage: d.UserImage,
            _id: d._id,
            req: {
              type: 'GET',
              url: 'http://127.0.0.56:4000/' + d._id
            }
          }
        })
      }
      res.status(200).json(responce)
    })
});

// router.get('/signup', function(req, res, next){

//     res.status(200).render('signUpPage')
// })

// router.get('/login',function(req, res, next){
//     res.status(200).render('loginPage')

// })

router.get("/:userId", function (req, res, next) {
  const id = req.params.userId
  Data.findById(id).exec().then(data => {
    console.log(data);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({
        message: 'invalid entry'
      })
    }

  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });

  })
});

router.post('/login', async (req, res, next) => {

  //VALIDATION BEFORE USER LOGIN
  const {
    error
  } = loginValidation(req.body);
  if (error) return res.json({
    message: error.details[0].message
  })


  Data.find({
      Name: req.body.Name
    })
    .exec()
    .then(user => {
      console.log(user[0]);
      if (user.length < 1) {
        //  res.status(201).render('userNotExist')
        res.status(500).json({
          message: 'user does not exist'
        })
      }
      // console.log(req.body.Password, user[0].Password);
      // var buf1 = Buffer.from(req.body.Password);
      // var buf2 = Buffer.from(user[0].Password);
      // var x = Buffer.compare(buf1, buf2 )
      // console.log(x);

      //password bcryption
      const x = bcrypt.compare(req.body.Password, user[0].Password)

      if (x) {
        // res.status(201).render('profilePage', {
        //   data: user[0] 
        // })
        // res.status(200).json({
        //   message: 'Login Sucessful',
        //   data: user[0]
        // });

        const token = jwt.sign({
          _id: user[0]._id
        }, process.env.TOKEN_SECRET)
        res.status(200).header('auth-token', token).json(token)
      } else {
        res.status(201).json({
          message: 'invalid password'
        })
      }


    })

})

router.get('/homepage', function (req, res, next) {
  res.status(200).render('homePage')
})

router.get('/', function (req, res, next) {
  res.status(200).render('homePage')
})

router.post('/signup', upload.single('UserImage'), async (req, res, next) => {


  //VALIDATION BEFORE USER CREATION
  const {
    error
  } = signupValidation(req.body);
  if (error) return res.json({
    message: error.details[0].message
  })

  //hash password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(req.body.Password, salt);

  const signupData = new Data({
    // _id: new mongoose.Types.ObjectId(),
    Name: req.body.Name,
    MobileNo: req.body.MobileNo,
    Password: hashedPassword,
    UserImage: req.file.path

  })


  Data.find({
    Name: req.body.Name
  }).exec().then(user => {
    if (user.length >= 1) {
      //res.status(201).render('userExist')
      res.status(200).json({
        message: 'user already exist'
      })
      //  return res.send("User exist")

    } else {
      signupData.save().then(data => {
        console.log(data);
        res.status(200).json({
          message: 'new way signup done',
          user: {
            name: data.Name,
            mobileNo: data.MobileNo,
            password: data.Password,
            userImage: req.file.path,
            _id: data._id,
            req: {
              type: 'GET',
              url: 'http://127.0.0.56:4000/' + data._id
            }
          }
        })
      }).catch(err => res.status(500).json({
        error: err
      }))
      // const hash = bcrypt.hashSync(req.body.Password, 10);
      // console.log(req.body.Password);
      // req.body.Password = hash;
      // Data.create(req.body).then(function(data){
      //   console.log(req.file);
      //   // res.send({
      //   //     data
      //   // })
      //   // res.status(201).render('profilePage', {
      //   //   data: data
      //   // })

      //   res.status(200).json({
      //     message: 'Signup Sucessful',
      //     user: {
      //       name: data.Name,
      //       mobileNo: data.MobileNo,
      //       password: data.Password,
      //       userImage: req.file.path,
      //       _id: data._id,
      //       req:{
      //         type: 'GET',
      //         url: 'http://127.0.0.56:4000/' + data._id
      //       }
      //     }
      //   })
      // }).catch(err => res.status(500).json({error: err}))
    }
  })

})

// // get a list of ninjas from the DB
// router.get('/ninjas', function(req,res, next){
//  res.status(200).send({
//    type: 'GET'
//  })

// })

// // add a new ninja to the DB
// router.post('/ninjas',urlencodedParser, function(req,res, next){
//   Data.create(req.body).then(function(data){
//     res.status(201).send(req.body)
//   }).catch(next)

// })

//update a ninja in DB
router.put('/user/:userId', function (req, res, next) {
  const id = req.params.userId
  const updateOps = {}
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value
  }
  // data must be in this format => [{
  // 	"propName": "Name",
  // 	"value": "123shivamgggg"
  // }]
  Data.update({
      _id: id
    }, {
      $set: updateOps
    })
    .exec()
    .then(result => {
      res.status(200).json({
        result: result
      });
    })
    .catch(err => {
      console.log(err);
      res
        .status(500)
        .json({
          error: err,
          message: "input data must be in array"
        });
    });

})


// delete a ninja from the DB
router.delete('/user/:userId', function (req, res, next) {
  const id = req.params.userId
  Data.remove({
    _id: id
  }).exec().then(result => {
    res.status(200).json(result)
  }).catch(err => {
    console.log(err)
    res.status(500).json({
      error: err
    })

  })
})


module.exports = router
