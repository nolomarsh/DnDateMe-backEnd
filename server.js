//******************
//** Dependencies **
//******************
const express = require('express')
const mongoose = require('mongoose')
const session = require('express-session')
const cors = require('cors')
const validator = require('validator')
const bcrypt = require('bcrypt')
require('dotenv').config()

const app = express()
//******************
//* Database Setup *
//******************
const PORT = process.env.PORT || 3003
const MONGODB_URI = process.env.MONGODB_URI
const db = mongoose.connection
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

// Error / success
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'))
db.on('connected', () => console.log('mongo connected: ', MONGODB_URI))
db.on('disconnected', () => console.log('mongo disconnected'))

//****************
//** Middleware **
//****************
app.use(cors())
app.use(express.json())

//*****************
//** Controllers **
//*****************
const usersController = require('./controllers/users.js')
app.use('/users', usersController)
const sessionsController = require('./controllers/sessions.js')
app.use('/sessions', sessionsController)
const chatsController = require('./controllers/chats.js')
app.use('/chats', chatsController)

//****************
//**** Routes ****
//****************
app.get('/', (req,res) => {
    res.redirect('/users')
})

//****************
//*** Listener ***
//****************
app.listen(PORT, () => {
    console.log("Listening on port:", PORT)
})
