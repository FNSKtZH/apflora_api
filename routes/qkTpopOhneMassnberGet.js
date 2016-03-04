'use strict'

const queryQkTpopOhneMassnber = require('../queries/qkTpopOhneMassnber.js')

module.exports = [
  {
    method: 'GET',
    path: '/qkTpopOhneMassnber/{apId}/{berichtjahr}',
    handler: queryQkTpopOhneMassnber
  }
]
