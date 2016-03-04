'use strict'

const queryTabelleUpdateApflora = require('../../queries/tabelleUpdateApflora.js')

module.exports = [
  {
    method: 'PUT',
    path: '/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateApflora
  }
]
