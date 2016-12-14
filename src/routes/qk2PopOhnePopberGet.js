'use strict'

const Joi = require(`joi`)
const queryQk2PopOhnePopber = require(`../handler/qk2PopOhnePopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qk2PopOhnePopber/{apId}/{berichtjahr}`,
    handler: queryQk2PopOhnePopber,
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
