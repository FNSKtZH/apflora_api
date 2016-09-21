'use strict'

const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  const node = {
    data: `Idealbiotop`,
    attr: {
      id: `idealbiotop${apId}`,
      typ: `idealbiotop`
    }
  }

  reply(null, node)
}
