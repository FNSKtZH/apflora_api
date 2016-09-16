'use strict'

const node = require(`../../queries/node/node.js`)

/**
 * queries:
 * - table
 * - id
 * - folder
 * - levels
 * TODO: validate with joi
 */

module.exports = [
  {
    method: `GET`,
    path: `/node`,
    handler: node,
  }
]
