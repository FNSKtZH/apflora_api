'use strict'

const queryPopKarteAlle = require(`../../handler/popKarteAlle.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popKarteAlle/apId={apId}`,
    handler: queryPopKarteAlle
  }
]
