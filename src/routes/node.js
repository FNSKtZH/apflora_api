'use strict'

const node = require(`../../queries/node/node.js`)

/**
 * queries:
 * - table
 * - id
 * - folder
 * - levels
 * example:
 * /node?table=projekt&id=1&levels=all
 * TODO: validate with joi
 */

module.exports = [
  {
    method: `GET`,
    path: `/node`,
    handler: node,
  }
]
