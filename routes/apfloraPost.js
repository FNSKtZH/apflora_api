'use strict'

const queryTabelleInsertApflora = require('../queries/tabelleInsertApflora.js')

module.exports = {
  method: 'POST',
  path: '/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
  handler: queryTabelleInsertApflora
}
