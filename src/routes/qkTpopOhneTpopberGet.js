'use strict'

const Joi = require(`joi`)
const queryQkTpopOhneTpopber = require(`../../handler/qkTpopOhneTpopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkTpopOhneTpopber/{apId}/{berichtjahr}`,
    handler: queryQkTpopOhneTpopber,
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
