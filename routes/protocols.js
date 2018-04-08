'use strict'

const express = require('express')
const router = express.Router()

// Bring in Models
let Club  = require('../models/club')
let Driver  = require('../models/driver')
let User  = require('../models/user')

// Home Route
router.get('/', (req, res) => {
  res.render('protocols_views/protocol')
})

// Access Control
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  } else {
    req.flash('danger', 'Please login')
    res.redirect('/users/login')
  }
}

module.exports = router
