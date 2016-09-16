'use strict'

const queryTpopMassnTypen = require(`../../queries/tpopMassnTypen.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopMassnTypen`,
    handler: queryTpopMassnTypen
  }
]
