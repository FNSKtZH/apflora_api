'use strict'

const Joi = require(`joi`)
const queryTPopKarteAlle = require(`../../handler/tpopKarteAlle.js`)

module.exports = [
  {
    method: `GET`,
    path: `/tpopKarteAlle/apId={apId}`,
    handler: queryTPopKarteAlle,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
