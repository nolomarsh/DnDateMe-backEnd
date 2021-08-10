const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Post = require('./post.js')

const groupSchema = mongoose.Schema({
    name: String,
    admin: String,
    location: String,
    image: String,
    joinRequests: [String],
    members: [String],
    chat: [String],
    posts: [Post.schema]
})

const Group = mongoose.model("Group", groupSchema)

module.exports = Group
