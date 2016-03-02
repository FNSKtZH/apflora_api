'use strict'

const queryTabelleSelectApfloraString = require('../queries/tabelleSelectApfloraString.js')

module.exports = {
  method: 'GET',
  path: '/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
  handler: queryTabelleSelectApfloraString
}
