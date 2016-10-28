'use strict'

const Joi = require(`joi`)
const queryPopKarte = require(`../handler/popKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popKarte/popId={popId}`,
    handler: queryPopKarte,
    config: {
      validate: {
        params: {
          popId: Joi.number().required(),
        }
      }
    }
  }
]
