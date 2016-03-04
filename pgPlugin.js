'use strict'

const config = require('./configuration')
const connectionString = config.pg.connectionString

module.exports = {
  register: require('hapi-node-postgres'),
  options: {
    connectionString: connectionString
  }
}
