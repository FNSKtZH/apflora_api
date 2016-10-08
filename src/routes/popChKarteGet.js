'use strict'

const queryPopChKarte = require(`../../handler/popChKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popChKarte/popId={popId}`,
    handler: queryPopChKarte
  }
]
