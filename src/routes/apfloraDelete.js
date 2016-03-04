'use strict'

const queryTabelleDeleteApflora = require('../../queries/tabelleDeleteApflora.js')

module.exports = [
  {
    method: 'DELETE',
    path: '/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
    handler: queryTabelleDeleteApflora
  }
]
