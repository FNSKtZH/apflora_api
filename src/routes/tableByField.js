'use strict'

const Joi = require(`joi`)
const tableByFieldGet = require(`../handler/tableByFieldGet.js`)

module.exports = [
  {
    method: `GET`,
    path: `/schema/{schema}/table/{table}/field/{field}/value/{value}`,
    handler: tableByFieldGet,
    config: {
      validate: {
        params: {
          table: Joi.string().required(),
          schema: Joi.string().required(),
          field: Joi.string().required(),
          value: Joi.alternatives().try(
            Joi.number().min(-2147483648).max(+2147483647),
            Joi.string()
          ).required(),
        }
      }
    }
  },
]
