'use strict'

const zielTypGet = require(`../handler/zielTypGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/zielTyp`,
    handler: zielTypGet,
  }
]
