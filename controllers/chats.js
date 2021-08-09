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

//Read - get chats including user
router.get('/byUser/:userId', (req,res) => {
    Chat.find({memberIds: req.params.userId}, (error, userChats) => {
        res.json(userChats)
    })
})

//Read - get particular chat
router.get('/:chatId', (req,res) => {
    Chat.findById(req.params.chatId, (error, foundChat) => {
        res.json(foundChat)
    })
})

//update title
router.put('/:id', (req,res) => {
    if (req.body.title){
        Chat.findByIdAndUpdate(req.params.id, {title:req.body.title}, {new:true}, (error, updatedChat) => {
            res.json(updatedChat)
        })
    }
    res.json({})
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

//update - remove member
router.put('/:id/removeUser', (req,res) => {
    Chat.findById(req.params.id, (error, foundChat) => {
        let memberIndex = foundChat.memberIds.indexOf(req.body.removedId)
        foundChat.memberIds.splice(memberIndex,1)
        foundChat.save((error, savedChat) => {
            res.json(savedChat)
        })
    })
})

//update - add message
router.put('/:id/addMessage', (req,res) => {
    Chat.findById(req.params.id, (error, foundChat) => {
        foundChat.messages.push({
            senderId: req.body.senderId,
            senderName: req.body.senderName,
            body: req.body.body
        })
        foundChat.save((error, savedChat) => {
            res.json(savedChat)
        })
    })
})

//clear chat history
router.put('/:id/clear', (req,res) => {
    Chat.findByIdAndUpdate(req.params.id, {messages:[]},{new:true},(error, updatedChat) => {
        res.json(updatedChat)
    })
})

//destroy
router.delete('/:id', (req,res) => {
    Chat.findByIdAndRemove(req.params.id, (error, removedChat) => {
        res.json(removedChat)
    })
})

module.exports = router
