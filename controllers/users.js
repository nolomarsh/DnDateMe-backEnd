const bcrypt = require('bcrypt')
const express = require('express')
const router =  express.Router()
const User = require('../models/users.js')

//Create(post) new user
router.post('/', (req,res) => {
    req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    User.create(req.body, (error, newUser) => {
        res.json(newUser)
    })
})

//Read(get) all users
router.get('/', (req,res) => {
    User.find({}, (error, allUsers) => {
        res.json(allUsers)
    })
})

//Show(get) single user
router.get('/:id', (req,res) => {
    User.findById(req.params.id, (error, foundUser) => {
        res.json(foundUser)
    })
})

//Update(put) user info
router.put('/:id', (req,res) => {
    if (req.body.password) {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
    }
    User.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedUser) => {
        res.json(updatedUser)
    })
})

// Send/cancel friend request
router.put('/friendRequest', (req,res) => {
    User.findById(req.body.senderId, (error, sender) => {
        User.findById(req.body.receiverId, (error, receiver) => {
            if(receiver.requestIds.includes(sender._id.toString())){
                let requestIndex = receiver.requestIds.indexOf(sender._id.toString())
                receiver.requestIds.splice(requestIndex,1)
            } else {
                receiver.requestIds.push(sender._id.toString())
            }
            receiver.save((error, savedUser) => {
                res.json(savedUser)
            })
        })
    })
})

// Accept/deny friend request
// router.put('/friendResponse', (req,res) => {
//     User.findById(req.body.senderId, (error, sender) => {
//         User.findById(req.body.receiverId)
//     })
// })

//Destroy(delete) single user
router.delete('/:id', (req,res) => {
    User.findByIdAndRemove(req.params.id, (error, removedUser) => {
        res.json(removedUser)
    })
})

module.exports = router
