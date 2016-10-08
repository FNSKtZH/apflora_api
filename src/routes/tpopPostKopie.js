'use strict'

const queryTpopInsertKopie = require(`../../handler/tpopInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}`,
    handler: queryTpopInsertKopie
  }
]
