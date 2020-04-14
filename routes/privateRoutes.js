const router = require('express').Router()
const auth = require('./verifyToken')

router.get('/p', auth,  (req,res)=>{
    res.json(req.user)
    console.log(res);
    
})

module.exports = router