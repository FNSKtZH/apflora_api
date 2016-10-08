'use strict'

const queryApKarte = require(`../../handler/apKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apKarte/apId={apId}`,
    handler: queryApKarte
  }
]
