'use strict'

const queryTpopKoordFuerProgramm = require('../queries/tpopKoordFuerProgramm.js')

module.exports = {
  method: 'GET',
  path: '/tpopKoordFuerProgramm/apId={apId}',
  handler: queryTpopKoordFuerProgramm
}
