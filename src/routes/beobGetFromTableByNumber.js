'use strict'

const queryTabelleSelectBeobNumber = require('../../queries/tabelleSelectBeobNumber.js')

module.exports = [
  {
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectBeobNumber
  }
]
