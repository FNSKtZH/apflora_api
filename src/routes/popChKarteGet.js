'use strict'

const Joi = require(`joi`)
const queryPopChKarte = require(`../../handler/popChKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popChKarte/popId={popId}`,
    handler: queryPopChKarte
  }
]
