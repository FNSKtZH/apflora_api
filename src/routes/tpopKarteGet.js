'use strict'

const queryTPopKarte = require(`../../handler/tpopKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarte/tpopId={tpopId}`,
    handler: queryTPopKarte
  }
]
