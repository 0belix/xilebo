'use strict'

const express = require('express')
const router = express.Router()

// Bring in Models
let Club  = require('../models/club')
let User  = require('../models/user')

// Home Route
router.get('/', (req, res) => {
  Club.find({}, (err, clubs) => {
    if (err) {
      console.log(err)
    } else {
      res.render('clubs_views/clubs', {
        clubs: clubs
      })
    }
  })
})

// Add Route
router.get('/add', ensureAuthenticated, (req, res) => {
  res.render('clubs_views/add_club')
})

// Add Submit POST Route
router.post('/add', (req, res) => {
  req.checkBody('name', 'Name is required').notEmpty()

  // Get Errors
  let errors = req.validationErrors()

  if (errors) {
    res.render('clubs_views/add_club', {
      errors: errors
    })
  } else {
    let club = new Club()
    club.name = req.body.name
    club.teamleader1 = req.body.teamleader1
    club.teamleader2 = req.body.teamleader2
    club.trackrecord = req.body.trackrecord
    club.misc = req.body.misc
    club.author = req.user._id
  
    club.save((err) => {
      if (err) {
        console.log(err)
        return
      } else {
        req.flash('success', 'Club Added')
        res.redirect('/clubs')
      }
    })
  }
})

// Load Edit Form
router.get('/edit/:id', ensureAuthenticated, (req, res) => {
  Club.findById(req.params.id, (err, club) => {
    if (club.author != req.user._id) {
      req.flash('danger', 'Not Authorized')
      res.redirect('/clubs')
    } else {
      res.render('clubs_views/edit_club', {
        club: club
      })
    }
  })
})

// Update Submit POST Route
router.post('/edit/:id', (req, res) => {
  let club = {}
  club.name = req.body.name
  club.teamleader1 = req.body.teamleader1
  club.teamleader2 = req.body.teamleader2
  club.trackrecord = req.body.trackrecord
  club.misc = req.body.misc
  club.author = req.user._id

  let query = {_id:req.params.id}

  Club.update(query, club, (err) => {
    if (err) {
      console.log(err)
      return
    } else {
      req.flash('success', 'Club Updated')
      res.redirect('/clubs/' + req.params.id)
    }
  })
})

// Get Single Club
router.get('/:id', (req, res) => {
  Club.findById(req.params.id, (err, club) => {
    User.findById(club.author, (err, user) => {
      res.render('clubs_views/club', {
        club: club,
        author: user.name
      })
    })
  })
})

// Delete Club
router.delete('/:id', (req, res) => {
  if (!req.user._id) {
    res.status(500).send()
  } else {
    let query = {_id:req.params.id}

    Club.findById(req.params.id, (err, club) => {
      if (club.author != req.user._id) {
        res.status(500).send()
      } else {
        Club.remove(query, (err) => {
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
