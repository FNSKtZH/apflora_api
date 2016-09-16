'use strict'

const queryTPopKarte = require(`../../queries/tpopKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarte/tpopId={tpopId}`,
    handler: queryTPopKarte
  }
]
