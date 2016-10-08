'use strict'

const queryQkTpopOhneMassnber = require(`../../handler/qkTpopOhneMassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkTpopOhneMassnber/{apId}/{berichtjahr}`,
    handler: queryQkTpopOhneMassnber
  }
]
