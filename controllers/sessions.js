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
                console.log(req.session)
                res.json(foundUser)
            } else {
                res.json({error:"Incorrect email/password"})
            }
        }
    })
})

router.get('/', (req,res) => {
    if (req.session.currentUser){
        User.findById(req.session.currentUser._id, (error, foundUser) => {
            if (error){
                console.log(error)
            }
            res.json(foundUser)
        })
    } else {
        res.json(req.session)
    }
})

router.delete('/', (req,res) => {
    req.session.destroy(() => {
        res.json("session destroyed")
    })
})

module.exports = router
