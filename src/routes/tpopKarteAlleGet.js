'use strict'

const queryTPopKarteAlle = require(`../../queries/tpopKarteAlle.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarteAlle/apId={apId}`,
    handler: queryTPopKarteAlle
  }
]
