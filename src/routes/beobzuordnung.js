'use strict'

const Joi = require(`joi`)
const queryBeobzuordnung = require(`../handler/beobzuordnung.js`)

module.exports = [
  {
    method: `GET`,
    path: `/beobzuordnung/{apId}`,
    handler: queryBeobzuordnung,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
