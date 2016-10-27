'use strict'

const Joi = require(`joi`)
const queryQkTpopOhneMassnber = require(`../../handler/qkTpopOhneMassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkTpopOhneMassnber/{apId}/{berichtjahr}`,
    handler: queryQkTpopOhneMassnber,
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
