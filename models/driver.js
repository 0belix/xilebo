'use strict'

const mongoose = require('mongoose')

// Driver Schema
const driverSchema = mongoose.Schema({
  firstname: {
    type: String,
    require: true
  },
  lastname: {
    type: String,
    require: true
  },
  driversfor: {
    type: String,
    require: true
  },
  joined: {
    type: Date,
    require: true
  },
  vacated: {
    type: Date,
    require: false
  },
  teamcaptain: {
    type: String,
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

let Driver = module.exports = mongoose.model('Driver', driverSchema)
