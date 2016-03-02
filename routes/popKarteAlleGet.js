'use strict'

const queryPopKarteAlle = require('../queries/popKarteAlle.js')

module.exports = {
  method: 'GET',
  path: '/popKarteAlle/apId={apId}',
  handler: queryPopKarteAlle
}
