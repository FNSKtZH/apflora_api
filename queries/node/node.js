'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const callHandler = {
    projekt() { projekt(request, callback) },
    ap() { ap(request, callback) }
  }

  callHandler[table]()
}
