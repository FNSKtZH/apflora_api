'use strict'

const Joi = require(`joi`)
const queryBeobNaechsteTpop = require(`../../handler/beobNaechsteTpop.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}`,
    handler: queryBeobNaechsteTpop,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
          X: Joi.number().required(),
          Y: Joi.number().required(),
        }
      }
    }
  }
]
