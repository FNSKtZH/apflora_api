'use strict'

const queryAp = require(`../../handler/ap.js`)
const queryApInsert = require(`../../handler/apInsert.js`)

module.exports = [
  {
    method: `GET`,
    path: `/ap={apId}`,
    handler: queryAp
  },
  {
    method: `POST`,
    path: `/apInsert/apId={apId}/user={user}`,
    handler: queryApInsert
  }
]
