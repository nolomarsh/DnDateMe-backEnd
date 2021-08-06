const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router()
const User = require('../models/users.js')

router.post('/', (req,res) => {
    User.findOne({email: req.body.email}, (error, foundUser) => {
        // console.log(req.body)
        if(error){
            console.log(error)
            res.send("DB error")
        } else if (!foundUser){
            console.log("No user found")
            res.send("No user found with that email")
        } else {
            if (bcrypt.compareSync(req.body.password, foundUser.password)){
                res.json(foundUser)
            } else {
                console.log("Incorrect password")
                res.send("Incorrect password")
            }
        }
    })
})

module.exports = router
