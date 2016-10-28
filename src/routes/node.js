'use strict'

const node = require(`../handler/node/node.js`)

/**
 * handler:
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
