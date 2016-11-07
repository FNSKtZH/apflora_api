'use strict'

const apStatusGet = require(`../handler/apStatusGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apStatus`,
    handler: apStatusGet,
  }
]
