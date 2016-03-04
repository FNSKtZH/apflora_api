'use strict'

const queryTabelleSelectApfloraNumber = require('../../queries/tabelleSelectApfloraNumber.js')

module.exports = [
  {
    method: 'GET',
    path: '/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectApfloraNumber
  }
]
