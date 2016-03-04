'use strict'

const queryTabelleSelectBeobString = require('../queries/tabelleSelectBeobString.js')

module.exports = [
  {
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectBeobString
  }
]
