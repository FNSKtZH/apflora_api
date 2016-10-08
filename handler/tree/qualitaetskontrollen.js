'use strict'

const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  const node = {
    data: `Qualitätskontrollen`,
    attr: {
      id: `qualitaetskontrollen${apId}`,
      typ: `qualitaetskontrollen`
    }
  }

  reply(null, node)
}
