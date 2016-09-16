'use strict'

const queryQkTpopOhneTpopber = require(`../../queries/qkTpopOhneTpopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkTpopOhneTpopber/{apId}/{berichtjahr}`,
    handler: queryQkTpopOhneTpopber
  }
]
