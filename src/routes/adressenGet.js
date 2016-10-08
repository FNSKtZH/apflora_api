'use strict'

const queryAdressen = require(`../../handler/adressen.js`)

module.exports = [
  {
    method: `GET`,
    path: `/adressen`,
    handler: queryAdressen
  }
]
