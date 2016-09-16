'use strict'

const queryPopChKarte = require(`../../queries/popChKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popChKarte/popId={popId}`,
    handler: queryPopChKarte
  }
]
