const mongoose = require('mongoose')
const Schema = mongoose.Schema

const postSchema = mongoose.Schema({
    title: String,
    body: String,
    author: String,
    image: String
})

const Post = mongoose.model("Post", postSchema)

module.exports = Post
