'use strict'

const Joi = require(`joi`)
const exportView = require(`../handler/exportView.js`)

module.exports = [
  {
    method: `GET`,
    path: `/exportView/json/view={view}`,
    handler: exportView,
    config: {
      validate: {
        params: {
          view: Joi.string().required(),
        }
      }
    }
  }
]
