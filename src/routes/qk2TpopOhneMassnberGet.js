'use strict'

const Joi = require(`joi`)
const queryQk2TpopOhneMassnber = require(`../handler/qk2TpopOhneMassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qk2TpopOhneMassnber/{apId}/{berichtjahr}`,
    handler: queryQk2TpopOhneMassnber,
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
