'use strict'

const queryApInsert = require('../queries/apInsert.js')

// TODO: make it /ap instead of /apInsert

module.exports = {
  method: 'POST',
  path: '/apInsert/apId={apId}/user={user}',
  handler: queryApInsert
}
