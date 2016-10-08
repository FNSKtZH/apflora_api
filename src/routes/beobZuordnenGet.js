'use strict'

const queryBeobZuordnen = require(`../../handler/beobZuordnen.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobZuordnen/apId={apId}`,
    handler: queryBeobZuordnen
  }
]
