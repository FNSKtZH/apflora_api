'use strict'

const Joi = require(`joi`)
const queryQk2TpopOhneTpopber = require(`../handler/qk2TpopOhneTpopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qk2TpopOhneTpopber/{apId}/{berichtjahr}`,
    handler: queryQk2TpopOhneTpopber,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
          berichtjahr: Joi.number().required(),
        }
      }
    }
  }
]
