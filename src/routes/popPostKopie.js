'use strict'

const queryPopInsertKopie = require(`../../handler/popInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/popInsertKopie/apId={apId}/popId={popId}/user={user}`,
    handler: queryPopInsertKopie
  }
]
