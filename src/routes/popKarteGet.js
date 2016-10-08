'use strict'

const queryPopKarte = require(`../../handler/popKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popKarte/popId={popId}`,
    handler: queryPopKarte
  }
]
