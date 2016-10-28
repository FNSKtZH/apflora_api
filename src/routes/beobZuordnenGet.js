'use strict'

const Joi = require(`joi`)
const queryBeobZuordnen = require(`../handler/beobZuordnen.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobZuordnen/apId={apId}`,
    handler: queryBeobZuordnen,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
