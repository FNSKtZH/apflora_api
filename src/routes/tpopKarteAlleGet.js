'use strict'

const queryTPopKarteAlle = require(`../../handler/tpopKarteAlle.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarteAlle/apId={apId}`,
    handler: queryTPopKarteAlle
  }
]
