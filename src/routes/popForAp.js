'use strict'

const Joi = require(`joi`)
const queryPopForAp = require(`../handler/popForAp.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popForAp/{apArtId}`,
    handler: queryPopForAp,
    config: {
      validate: {
        params: {
          apArtId: Joi.number().required(),
        }
      }
    }
  }
]
