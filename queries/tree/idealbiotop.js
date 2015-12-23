'use strict'

var escapeStringForSql = require('../escapeStringForSql')

module.exports = function (request, reply) {
  var apId
  var node

  apId = escapeStringForSql(request.params.apId)

  node = {}
  node.data = 'Idealbiotop'
  node.attr = {
    id: 'idealbiotop' + apId,
    typ: 'idealbiotop'
  }

  reply(null, node)
}
