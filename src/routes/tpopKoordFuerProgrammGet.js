'use strict'

const queryTpopKoordFuerProgramm = require(`../handler/tpopKoordFuerProgramm.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKoordFuerProgramm/apId={apId}`,
    handler: queryTpopKoordFuerProgramm
  }
]
