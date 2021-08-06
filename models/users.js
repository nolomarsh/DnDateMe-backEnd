const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    email: {type:String, required:true, unique:true},
    password: {type:String, required:true},
    firstName: String,
    lastName: String,
    pronouns: String,
    faveClass: [String],
    profileImg: String,
    friendIds: [String],
    requestIds: [String]
})

const User = mongoose.model("User", userSchema)

module.exports = User
