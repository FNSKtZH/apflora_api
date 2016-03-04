'use strict'

const queryTpopkontrInsertKopie = require('../../queries/tpopkontrInsertKopie.js')

module.exports = [
  {
    method: 'POST',
    path: '/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}',
    handler: queryTpopkontrInsertKopie
  }
]
