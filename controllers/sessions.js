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
                req.session.currentUser = foundUser
                res.json(foundUser)
            } else {
                res.json({error:"Incorrect email/password"})
            }
        }
    })
})

router.post('/loggedInUser', (req,res) => {
    User.findById(req.session.currentUser._id, (error, foundUser) => {
        res.json(foundUser)
    })
})

router.delete('/', (req,res) => {
    req.session.destroy()
})

module.exports = router
