/* jshint asi: true, browser: true, expr: true, node: true, esversion: 6 */

'use strict'

const mongoose = require('mongoose')

// Club Schema
let clubSchema = mongoose.Schema({
  name: {
    type: String,
    require: true
  },
  author: {
    type: String,
    require: true
  },
  misc: {
    type: String,
    require: true
  },
})

let Club = module.exports = mongoose.model('Club', clubSchema)
