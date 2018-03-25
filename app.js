/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const express = require('express')
const path = require('path')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost/speedway')
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
let Club  = require('./models/club')

// Load View Engine (templates)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', (req, res) => {
  Club.find({}, (err, clubs) => {
    if (err) {
      console.log(err)
    } else {
      res.render('index', {
        clubs: clubs
      })
    }
  })
})

// Add Route
app.get('/club/add', (req, res) => {
  res.render('add_club')
})

// Add Submit POST Route
app.post('/club/add', (req, res) => {
  let club = new Club()
  club.name = req.body.name
  club.author = req.body.author
  club.misc = req.body.misc

  club.save((err) => {
    if (err) {
      console.log(err)
      return
    } else {
      res.redirect('/')
    }
  })
})

// Start Server
app.listen(3000, () => {
  console.log('Server started on port 3000...')
})
