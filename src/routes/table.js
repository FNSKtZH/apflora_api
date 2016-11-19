'use strict'

const Joi = require(`joi`)
const tableGet = require(`../handler/tableGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/schema/{schema}/table/{table}`,
    handler: tableGet,
    config: {
      validate: {
        params: {
          table: Joi.string().required(),
          schema: Joi.string().required(),
        }
      }
    }
  },
]
