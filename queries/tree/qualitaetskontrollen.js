'use strict'

var escapeStringForSql = require('../escapeStringForSql')

module.exports = function (request, reply) {
  var apId,
    node

  apId = escapeStringForSql(request.params.apId)

  node = {}
  node.data = 'Qualitätskontrollen'
  node.attr = {
    id: 'qualitaetskontrollen' + apId,
    typ: 'qualitaetskontrollen'
  }

  reply(null, node)
}
