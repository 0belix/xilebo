'use strict'

const express = require('express')
const router = express.Router()

// Bring in Models
let Club  = require('../models/club')
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
  Club.find({}, (err, clubs) => {
    if (err) {
      console.log(err)
    } else {
      res.render('drivers_views/add_driver', {
        clubs: clubs
      })
    }
  })
})

// Add Submit POST Route
router.post('/add', (req, res) => {
  req.checkBody('firstname', 'Firstname is required').notEmpty()
  req.checkBody('lastname', 'Lastname is required').notEmpty()
  req.checkBody('driversfor', 'Club is required').exists()
  req.checkBody('joined', 'Date for joined is required').notEmpty()

  // Get Errors
  let errors = req.validationErrors()

  if (errors) {
    Club.find({}, (err, clubs) => {
      if (err) {
        console.log(err)
      } else {
        res.render('drivers_views/add_driver', {
          errors: errors,
          clubs: clubs
        })
      }
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
      Club.find({}, (err, clubs) => {
        if (err) {
          console.log(err)
        } else {
          res.render('drivers_views/edit_driver', {
            driver: driver,
            clubs: clubs
          })
        }
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
    Club.findById(driver.driversfor, (err, club) => {
      res.render('drivers_views/driver', {
        driver: driver,
        driversfor: club.name
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
