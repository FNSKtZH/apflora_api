'use strict'

const tpopmassnTypGet = require(`../handler/tpopmassnTypGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopmassnTyp`,
    handler: tpopmassnTypGet,
  }
]
