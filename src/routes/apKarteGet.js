'use strict'

const queryApKarte = require(`../../queries/apKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apKarte/apId={apId}`,
    handler: queryApKarte
  }
]
