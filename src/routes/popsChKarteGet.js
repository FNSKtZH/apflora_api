'use strict'

const queryPopsChKarte = require(`../../handler/popsChKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popsChKarte/apId={apId}`,
    handler: queryPopsChKarte
  }
]
