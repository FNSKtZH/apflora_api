'use strict'

const queryAp = require('../queries/ap.js')

module.exports = {
  method: 'GET',
  path: '/ap={apId}',
  handler: queryAp
}
