'use strict'

const queryTPopsKarte = require('../queries/tpopsKarte.js')

module.exports = [
  {
    method: 'GET',
    path: '/tpopsKarte/popId={popId}',
    handler: queryTPopsKarte
  }
]
