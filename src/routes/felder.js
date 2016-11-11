'use strict'

const queryFelder = require(`../handler/felderGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/felder`,
    handler: queryFelder
  }
]
