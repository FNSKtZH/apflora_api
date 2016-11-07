'use strict'

const apUmsetzungGet = require(`../handler/apUmsetzungGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apUmsetzung`,
    handler: apUmsetzungGet,
  }
]
