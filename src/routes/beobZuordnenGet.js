'use strict'

const queryBeobZuordnen = require('../../queries/beobZuordnen.js')

module.exports = [
  {
    method: 'GET',
    path: '/beobZuordnen/apId={apId}',
    handler: queryBeobZuordnen
  }
]
