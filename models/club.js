'use strict'

const mongoose = require('mongoose')

// Club Schema
const clubSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
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
