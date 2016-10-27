'use strict'

const Joi = require(`joi`)
const queryApKarte = require(`../../handler/apKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/apKarte/apId={apId}`,
    handler: queryApKarte,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
