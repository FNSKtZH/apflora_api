'use strict'

const queryQkTpopOhneTpopber = require(`../../handler/qkTpopOhneTpopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkTpopOhneTpopber/{apId}/{berichtjahr}`,
    handler: queryQkTpopOhneTpopber
  }
]
