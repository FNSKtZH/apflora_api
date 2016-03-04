'use strict'

const queryPopKarte = require('../../queries/popKarte.js')

module.exports = [
  {
    method: 'GET',
    path: '/popKarte/popId={popId}',
    handler: queryPopKarte
  }
]
