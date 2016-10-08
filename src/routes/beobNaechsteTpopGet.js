'use strict'

const queryBeobNaechsteTpop = require(`../../handler/beobNaechsteTpop.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}`,
    handler: queryBeobNaechsteTpop
  }
]
