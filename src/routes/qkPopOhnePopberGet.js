'use strict'

const queryQkPopOhnePopber = require(`../../handler/qkPopOhnePopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopber
  }
]
