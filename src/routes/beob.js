'use strict'

const queryTabelleSelectBeobNumber = require('../../queries/tabelleSelectBeobNumber.js')
const queryTabelleSelectBeobString = require('../../queries/tabelleSelectBeobString.js')

module.exports = [
  {
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectBeobNumber
  },
  {
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectBeobString
  }
]
