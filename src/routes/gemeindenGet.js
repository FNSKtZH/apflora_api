'use strict'

const queryGemeinden = require('../../queries/gemeinden.js')

module.exports = [
  {
    method: 'GET',
    path: '/gemeinden',
    handler: queryGemeinden
  }
]
