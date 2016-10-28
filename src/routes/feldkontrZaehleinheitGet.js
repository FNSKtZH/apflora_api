'use strict'

const queryFeldkontrZaehleinheit = require(`../handler/feldkontrZaehleinheit.js`)

module.exports = [
  {
    method: `GET`,
    path: `/feldkontrZaehleinheit`,
    handler: queryFeldkontrZaehleinheit
  }
]
