const mongoose = require('mongoose')

const chatSchema = mongoose.Schema({
    title: String,
    memberIds: [String],
    messages: [{
        senderId: String,
        body: String,
    }]
})

const Chat = mongoose.model("Chat", chatSchema)

module.exports = Chat
