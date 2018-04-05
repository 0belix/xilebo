/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport')
const config = require('./config/database')

mongoose.connect(config.database)
let db = mongoose.connection

// Check connection
db.once('open', () => {
  console.log('Connected to MongoDB')
})

// Check for DB errors
db.on('error', (error) => {
  console.log(error)
})

// Init App
const app = express()

// Bring in Models

// Load View Engine (templates)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')))

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}))

// Express Messages Middleware
app.use(require('connect-flash')())
app.use((req, res, next) => {
  res.locals.messages = require('express-messages')(req, res)
  next()
})

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']'
    }

    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

// Passport Config
require('./config/passport')(passport)
// Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

// Global variable for the user objects
app.get('*', (req, res, next) => {
  res.locals.user = req.user || null
  next()
})

// Home Route
app.get('/', (req, res) => {
  res.render('index')
})

// CV Route
app.get('/cv', (req, res) => {
  res.render('cv')
})

// Route Files
let clubs = require('./routes/clubs')
let drivers = require('./routes/drivers')
let users = require('./routes/users')
app.use('/clubs', clubs)
app.use('/drivers', drivers)
app.use('/users', users)

// Start Server
app.listen(80, () => {
  console.log('Server started on port 80...')
})
