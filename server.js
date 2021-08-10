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

//*****************
//** Controllers **
//*****************
const usersController = require('./controllers/users.js')
const sessionsController = require('./controllers/sessions.js')
const chatsController = require('./controllers/chats.js')
const groupsController = require('./controllers/groups.js')

//****************
//** Middleware **
//****************
app.use(cors())
app.use(express.json())
app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
)
app.use('/users', usersController)
app.use('/sessions', sessionsController)
app.use('/chats', chatsController)
app.use('/groups', groupsController)

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
