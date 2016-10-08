'use strict'

const queryTpopkontrInsertKopie = require(`../../handler/tpopkontrInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}`,
    handler: queryTpopkontrInsertKopie
  }
]
