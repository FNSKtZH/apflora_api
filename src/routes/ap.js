'use strict'

const Joi = require(`joi`)
const queryAp = require(`../../handler/ap.js`)
const queryApInsert = require(`../../handler/apInsert.js`)

module.exports = [
  {
    method: `GET`,
    path: `/ap={apId}`,
    handler: queryAp
  },
  {
    method: `POST`,
    path: `/apInsert/apId={apId}/user={user}`,
    handler: queryApInsert,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
