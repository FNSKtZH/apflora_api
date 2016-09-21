'use strict'

const projekt = require(`./projekt.js`)

// TODO: get real user

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const callHandler = {
    projekt() { projekt(request, callback) }
  }

  callHandler[table]()
}
