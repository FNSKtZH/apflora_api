'use strict'

const queryTabelleUpdateBeob = require('../../queries/tabelleUpdateBeob.js')

module.exports = [
  {
    method: 'PUT',
    path: '/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateBeob
  }
]
