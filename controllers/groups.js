const express = require('express')
const router = express.Router()
const Group = require('../models/groups.js')
const Post = require('../models/post.js')
const User = require('../models/users.js')

//create group
router.post('/', (req,res) => {
    Group.create(req.body, (error, createdGroup) => {
        res.json(createdGroup)
    })
})

//get all group data
router.get('/', (req, res) => {
    Group.find({}, (err, allGroups) => {
      res.json(allGroups)
    })
})

//get single group data
router.get('/:id', (req,res) => {
    Group.findById(req.params.id, (err, foundGroup) => {
      res.json(foundGroup)
    })
})

//edit group
router.put('/:id', (req,res) => {
    Group.findByIdAndUpdate(req.params.id, req.body, (err, foundGroup) => {
      res.json(foundGroup)
    })
})

//send group join request
router.put('/:groupid/:requestid', (req,res) => {
    User.findById(req.params.requestid, (error, foundUser) => {
        Group.findById(req.params.groupid, (error, foundGroup) => {
          foundGroup.joinRequests.push(foundUser._id)
          foundGroup.save((err, data) => {
            res.json(foundGroup)
          })
        })
    })
})

//accept group join request
router.put('/:groupid/:requestid/accept', (req,res) => {
    Group.findByIdAndUpdate({ _id: req.params.groupid}, { '$pull': { 'joinRequests': req.params.requestid }}, { safe: true, multi:true }, (err, changedGroup) => {
      changedGroup.members.push(req.params.requestid)
      changedGroup.save((err, data) => {
        res.json(changedGroup)
      })
    })
})

//deny group join request
router.put('/:groupid/:requestid/deny', (req,res) => {
    Group.findByIdAndUpdate({ _id: req.params.groupid}, { '$pull': { 'joinRequests': req.params.requestid }}, { safe: true, multi:true }, (err, changedGroup) => {
      res.json(changedGroup)
    })
})

module.exports = router
