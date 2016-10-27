'use strict'

const Joi = require(`joi`)
const queryQkPopOhnePopmassnber = require(`../../handler/qkPopOhnePopmassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopmassnber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopmassnber,
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
