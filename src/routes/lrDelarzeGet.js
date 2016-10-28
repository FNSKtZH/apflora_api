'use strict'

const queryLrDelarze = require(`../handler/lrDelarze.js`)

module.exports = [
  {
    method: `GET`,
    path: `/lrDelarze`,
    handler: queryLrDelarze
  }
]
