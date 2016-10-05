'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)
const pop = require(`./pop`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const callHandler = {
    projekt() { projekt(request, callback) },
    ap() { ap(request, callback) },
    pop() { pop(request, callback) },
  }

  callHandler[table]()
}
