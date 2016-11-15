'use strict'

const tpopkontrzaehlEinheitGet = require(`../handler/tpopkontrzaehlEinheitGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopkontrzaehlEinheit`,
    handler: tpopkontrzaehlEinheitGet,
  }
]
