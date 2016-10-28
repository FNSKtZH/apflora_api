'use strict'

const queryTPopsKarte = require(`../handler/tpopsKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopsKarte/popId={popId}`,
    handler: queryTPopsKarte
  }
]
