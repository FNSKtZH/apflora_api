'use strict'

const queryTpopmassnInsertKopie = require('../queries/tpopmassnInsertKopie.js')

module.exports = {
  method: 'POST',
  path: '/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}',
  handler: queryTpopmassnInsertKopie
}
