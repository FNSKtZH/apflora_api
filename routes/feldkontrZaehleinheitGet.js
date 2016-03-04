'use strict'

const queryFeldkontrZaehleinheit = require('../queries/feldkontrZaehleinheit.js')

module.exports = [
  {
    method: 'GET',
    path: '/feldkontrZaehleinheit',
    handler: queryFeldkontrZaehleinheit
  }
]
