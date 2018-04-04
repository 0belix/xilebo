'use strict'

/* TODO: Add following function: edit user, delete user, a user page. */

const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')

// Bring in Models
let User  = require('../models/user')

// Register Form
router.get('/register', ensureAuthenticated, (req, res) => {
  res.render('users_views/register')
})

// Register Proccess
router.post('/register', (req, res) => {
  const name = req.body.name
  const email = req.body.email
  const email2 = req.body.email2
  const username = req.body.username
  const password = req.body.password
  const password2 = req.body.napassword2me

  req.checkBody('name', 'Name is required').notEmpty()
  req.checkBody('email', 'Email is required').notEmpty()
  req.checkBody('email', 'Email is not valid').isEmail()
  req.checkBody('email2', 'Emails do not match').equals(req.body.email)
  req.checkBody('username', 'Username is required').notEmpty()
  req.checkBody('password', 'Password is required').notEmpty()
  req.checkBody('password', 'Password is to short').isLength(6)
  req.checkBody('password2', 'Passwords do not match').equals(req.body.password)

  let errors = req.validationErrors()

  if (errors) {
    res.render('users_views/register', {
      errors: errors
    })
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    })

    bcrypt.genSalt(13, (err, salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) {
          console.log(err)
        } else {
          newUser.password = hash
          newUser.save((err) => {
            if (err) {
              console.log(err)
            } else {
              req.flash('success', 'You are now registered and can log in')
              res.redirect('/users/login')
            }
          })
        }
      })
    })
  }
})

// Login Form
router.get('/login', (req, res) => {
  res.render('users_views/login')
})

// Login Process
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next)
})

// Logout
router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'You are logged out')
  res.redirect('/users/login')
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
