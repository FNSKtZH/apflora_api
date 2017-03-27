'use strict'

const Joi = require(`joi`)
const exportView = require(`../handler/exportView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/exportView/json/view={view}/{apId}`,
    handler: exportView,
    config: {
      validate: {
        params: {
          view: Joi.string().required(),
          apId: Joi.number().required(),
        }
      }
    }
  }
]
