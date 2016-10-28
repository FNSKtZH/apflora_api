'use strict'

const queryTpopMassnTypen = require(`../handler/tpopMassnTypen.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopMassnTypen`,
    handler: queryTpopMassnTypen
  }
]
