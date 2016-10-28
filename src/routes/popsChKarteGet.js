'use strict'

const Joi = require(`joi`)
const queryPopsChKarte = require(`../handler/popsChKarte.js`)

module.exports = [
  {
    method: `GET`,
    path: `/popsChKarte/apId={apId}`,
    handler: queryPopsChKarte,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
        }
      }
    }
  }
]
