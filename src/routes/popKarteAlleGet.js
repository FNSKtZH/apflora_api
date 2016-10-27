'use strict'

const Joi = require(`joi`)
const queryPopKarteAlle = require(`../../handler/popKarteAlle.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popKarteAlle/apId={apId}`,
    handler: queryPopKarteAlle,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
