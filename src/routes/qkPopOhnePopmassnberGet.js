'use strict'

const queryQkPopOhnePopmassnber = require(`../../handler/qkPopOhnePopmassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopmassnber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopmassnber
  }
]
