'use strict'

const Joi = require(`joi`)
const queryQkPopOhnePopber = require(`../handler/qkPopOhnePopber.js`)

module.exports = [
  {
    method: `GET`,
    path: `/qkPopOhnePopber/{apId}/{berichtjahr}`,
    handler: queryQkPopOhnePopber,
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
