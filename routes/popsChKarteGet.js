'use strict'

const queryPopsChKarte = require('../queries/popsChKarte.js')

module.exports = [
  {
    method: 'GET',
    path: '/popsChKarte/apId={apId}',
    handler: queryPopsChKarte
  }
]
