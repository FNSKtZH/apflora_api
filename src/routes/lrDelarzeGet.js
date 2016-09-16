'use strict'

const queryLrDelarze = require(`../../queries/lrDelarze.js`)

module.exports = [
  {
    method: `GET`,
    path: `/lrDelarze`,
    handler: queryLrDelarze
  }
]
