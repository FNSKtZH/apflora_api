'use strict'

const queryQkPopOhnePopber = require(`../../queries/qkPopOhnePopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopber
  }
]
