'use strict'

const Joi = require(`joi`)
const queryAp = require(`../handler/ap.js`)
const queryApInsert = require(`../handler/apInsert.js`)

module.exports = [
  {
    method: `GET`,
    path: `/ap={apId}`,
    handler: queryAp,
  },
]
