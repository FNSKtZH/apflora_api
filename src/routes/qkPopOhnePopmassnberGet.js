'use strict'

const queryQkPopOhnePopmassnber = require(`../../queries/qkPopOhnePopmassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopmassnber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopmassnber
  }
]
