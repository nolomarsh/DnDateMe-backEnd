const express = require('express')
const router = express.Router()
const Chat = require('../models/chats.js')
const User = require('../models/users.js')

//create
router.post('/', (req,res) => {
    Chat.create(req.body, (error, newChat) => {
        res.json(newChat)
    })
})

//Read
router.get('/', (req,res) => {
    Chat.find({}, (error, allChats) => {
        res.json(allChats)
    })
})


//update - add user
router.put('/:id/addUser', (req,res) => {
    //find chat to extract
    Chat.findById(req.params.id, (error, foundChat) => {
        let users = [...foundChat.memberIds]

        req.body.memberIds = [...users,...req.body.newIds]

        Chat.findByIdAndUpdate(req.params.id, req.body, {new:true}, (error, updatedChat) => {
            res.json(updatedChat)
        })
    })
})

//update - add message
router.post('/:id/addMessage', (req,res) => {
    Chat.findById(req.params.id, (error, foundChat) => {
        foundChat.messages.push({
            senderId: req.body.senderId,
            body: req.body.body
        })
        foundChat.save((error, savedChat) => {
            res.json(savedChat)
        })
    })
})

//destroy
router.delete('/:id', (req,res) => {
    Chat.findByIdAndRemove(req.params.id, (error, removedChat) => {

    })
})

module.exports = router
