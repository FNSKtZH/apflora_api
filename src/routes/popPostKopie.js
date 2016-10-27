'use strict'

const Joi = require(`joi`)
const queryPopInsertKopie = require(`../../handler/popInsertKopie.js`)

module.exports = [
  {
    method: `POST`,
    path: `/popInsertKopie/apId={apId}/popId={popId}/user={user}`,
    handler: queryPopInsertKopie,
    config: {
      validate: {
        params: {
          apId: Joi.number().required(),
          popId: Joi.number().required(),
          user: Joi.string().required(),
        }
      }
    }
  }
]
