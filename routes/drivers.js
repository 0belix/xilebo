'use strict'

const express = require('express')
const router = express.Router()

// Bring in Models
let Driver  = require('../models/driver')
let User  = require('../models/user')

// Home Route
router.get('/', (req, res) => {
  Driver.find({}, (err, drivers) => {
    if (err) {
      console.log(err)
    } else {
      res.render('drivers_views/drivers', {
        drivers: drivers
      })
    }
  })
})

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('drivers_views/add_driver')
})

// Add Submit POST Route
router.post('/add', (req, res) => {
  req.checkBody('firstname', 'Firstname is required').notEmpty()
  req.checkBody('lastname', 'Lastame is required').notEmpty()
  req.checkBody('driversfor', 'Clubb is required').notEmpty()
  req.checkBody('joined', 'Date for joined is required').notEmpty()

  // Get Errors
  let errors = req.validationErrors()

  if (errors) {
    res.render('drivers_views/add_driver', {
      errors: errors
    })
  } else {
    let driver = new Driver()
    driver.firstname = req.body.firstname
    driver.lastname = req.body.lastname
    driver.driversfor = req.body.driversfor
    driver.joined = req.body.joined
    driver.vacated = req.body.vacated
    driver.teamcaptain = req.body.teamcaptain
    driver.misc = req.body.misc
    driver.author = req.user._id
  
    driver.save((err) => {
      if (err) {
        console.log(err)
        return
      } else {
        req.flash('success', 'Driver Added')
        res.redirect('/drivers')
      }
    })
  }
})

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Driver.findById(req.params.id, (err, driver) => {
    if (driver.author != req.user._id) {
      req.flash('danger', 'Not Authorized')
      res.redirect('/drivers')
    } else {
      res.render('drivers_views/edit_driver', {
        driver: driver
      })
    }
  })
})

// Update Submit POST Route
router.post('/edit/:id', (req, res) => {
  let driver = {}
  driver.firstname = req.body.firstname
  driver.lastname = req.body.lastname
  driver.driversfor = req.body.driversfor
  driver.joined = req.body.joined
  driver.vacated = req.body.vacated
  driver.teamcaptain = req.body.teamcaptain
  driver.misc = req.body.misc
  driver.author = req.user._id

  let query = {_id:req.params.id}

  Driver.update(query, driver, (err) => {
    if (err) {
      console.log(err)
      return
    } else {
      req.flash('success', 'Driver Updated')
      res.redirect('/drivers/' + req.params.id)
    }
  })
})

// Get Single Driver
router.get('/:id', (req, res) => {
  Driver.findById(req.params.id, (err, driver) => {
    User.findById(driver.author, (err, user) => {
      res.render('drivers_views/driver', {
        driver: driver,
        author: user.name
      })
    })
  })
})

// Delete Driver
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send()
  } else {
    let query = {_id:req.params.id}

    Driver.findById(req.params.id, (err, driver) => {
      if (driver.author != req.user._id) {
        res.status(500).send()
      } else {
        Driver.remove(query, (err) => {
          if (err) {
            console.log(err)
          } else {
            res.send('Success')
          }
        })
      }
    })
  }
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
