'use strict'

const Joi = require(`joi`)
const queryQk2PopOhnePopmassnber = require(`../handler/qk2PopOhnePopmassnber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qk2PopOhnePopmassnber/{apId}/{berichtjahr}`,
    handler: queryQk2PopOhnePopmassnber,
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
