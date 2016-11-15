'use strict'

const tpopkontrzaehlMethodeGet = require(`../handler/tpopkontrzaehlMethodeGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopkontrzaehlMethode`,
    handler: tpopkontrzaehlMethodeGet,
  }
]
