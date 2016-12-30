'use strict'

const Joi = require(`joi`)
const queryTpopForAp = require(`../handler/tpopForAp.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopForAp/{apArtId}`,
    handler: queryTpopForAp,
    config: {
      validate: {
        params: {
          apArtId: Joi.number().required(),
        }
      }
    }
  }
]
