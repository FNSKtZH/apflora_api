'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)
const pop = require(`./pop`)
const tpop = require(`./tpop`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const callHandler = {
    projekt() { projekt(request, callback) },
    ap() { ap(request, callback) },
    pop() { pop(request, callback) },
    tpop() { tpop(request, callback) },
  }

  callHandler[table]()
}
