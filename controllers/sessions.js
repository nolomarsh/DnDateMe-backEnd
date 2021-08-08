const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/users.js')

router.post('/', (req,res) => {
    User.findOne({email: req.body.email}, (error, foundUser) => {
        // console.log(req.body)
        if(error){
            res.json({error:"Database error"})
        } else if (!foundUser){
            res.json({error:"No user found with that email"})
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)){
                res.json(foundUser)
            } else {
                res.json({error:"Incorrect email/password"})
            }
        }
    })
})

module.exports = router
