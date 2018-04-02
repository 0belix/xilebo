'use strict'

const mongoose = require('mongoose')

// Club Schema
const clubSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  teamleader1: {
    type: String,
    require: false
  },
  teamleader2: {
    type: String,
    require: false
  },
  trackrecord: {
    type: Number,
    require: false
  },
  misc: {
    type: String,
    require: false
  },
  author: {
    type: String,
    require: true
  }
})

let Club = module.exports = mongoose.model('Club', clubSchema)
