'use strict'

const queryAp = require('../../queries/ap.js')
const queryApInsert = require('../../queries/apInsert.js')

module.exports = [
  {
    method: 'GET',
    path: '/ap={apId}',
    handler: queryAp
  },
  {
    method: 'POST',
    path: '/apInsert/apId={apId}/user={user}',
    handler: queryApInsert
  }
]
