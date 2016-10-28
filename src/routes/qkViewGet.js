'use strict'

const Joi = require(`joi`)
const queryQkView = require(`../handler/qkView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkView/{viewName}/{apId}/{berichtjahr?}`,
    handler: queryQkView,
    config: {
      validate: {
        params: {
          viewName: Joi.string().required(),
          apId: Joi.number().required(),
          berichtjahr: Joi.number(),
        }
      }
    }
  }
]
