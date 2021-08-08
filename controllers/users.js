const bcrypt = require('bcrypt')
const express = require('express')
const router =  express.Router()
const User = require('../models/users.js')

//Create(post)
router.post('/', (req,res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    User.create(req.body, (error, newUser) => {
        res.json(newUser)
    })
})

//Read(get)
router.get('/', (req,res) => {
    User.find({}, (error, allUsers) => {
        res.json(allUsers)
    })
})

//Update(put)
router.put('/:id', (req,res) => {
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }
    User.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedUser) => {
        res.json(updatedUser)
    })
})

//Destroy(delete)
router.delete('/:id', (req,res) => {
    User.findByIdAndRemove(req.params.id, (error, removedUser) => {
        res.json(removedUser)
    })
})

module.exports = router
