'use strict'

const queryAdressen = require('../../queries/adressen.js')

module.exports = [
  {
    method: 'GET',
    path: '/adressen',
    handler: queryAdressen
  }
]
