'use strict'

const queryTpopmassnInsertKopie = require(`../../handler/tpopmassnInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}`,
    handler: queryTpopmassnInsertKopie
  }
]
