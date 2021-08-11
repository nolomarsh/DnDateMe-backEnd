const bcrypt = require('bcrypt')
const express = require('express')
const router =  express.Router()
const User = require('../models/users.js')
const Group = require('../models/groups.js')

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

router.put('/handleRequest', (req,res) => {
    User.findById(req.body.senderId, (error, sender) => {
        User.findById(req.body.receiverId, (error, receiver) => {
            let requestIndex = receiver.requestIds.indexOf(sender._id.toString())
            receiver.requestIds.splice(requestIndex,1)
            if(req.body.status === "accept"){
                  receiver.friendIds.push(sender._id.toString())
                  sender.friendIds.push(receiver._id.toString())
            }
            sender.save()
            receiver.save((error, savedUser) => {
                res.json(savedUser)
            })
        })
    })
})

router.put('/handleUnFriend', (req,res) => {
    User.findById(req.body.senderId, (error, sender) => {
        User.findById(req.body.receiverId, (error, receiver) => {
            let removeIndexSender = reciever.friendIds.indexOf(sender._id.toString())
            reciever.friendIds.splice(removeIndexSender,1)
            let removeIndexReceiver = sender.friendIds.indexOf(receiver._id.toString())
            sender.friendIds.splice(removeIndexReceiver,1)
            receiver.save()
            sender.save((error, savedUser) => {
                res.json(savedUser)
            })
        })
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

//Destroy(delete) single user
router.delete('/:id', (req,res) => {
    User.findByIdAndRemove(req.params.id, (error, removedUser) => {
        User.find({friendIds: req.params.id}, (error, foundUsers) => {
            for (let user of foundUsers) {
                let friendIndex = user.friendIds.indexOf(req.params.id)
                user.friendIds.splice(friendIndex,1)
                user.save()
            }
        })
        User.find({requestIds: req.params.id}, (error, foundUsers) => {
            for (let user of foundUsers){
                let requestIndex = user.requestIds.indexOf(req.params.id)
                user.requestIds.splice(requestIndex, 1)
                user.save()
            }
        })
        Group.find({members: req.params.id}, (error, foundGroups) => {
            for (let group of foundGroups) {
                let memberIndex = group.members.indexOf(req.params.id)
                group.members.splice(memberIndex,1)
                group.save()
            }
        })
        req.session.destroy(() => {
            res.json(removedUser)
        })
    })
})

module.exports = router
