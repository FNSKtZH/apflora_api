'use strict'

const queryBeobNaechsteTpop = require('../queries/beobNaechsteTpop.js')

module.exports = [
  {
    method: 'GET',
    path: '/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}',
    handler: queryBeobNaechsteTpop
  }
]
