'use strict'

const projekt = require('./projekt.js')

// TODO: get real user

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.params.table)

  // TODO: distribute to separate functions
  if (table === 'projekt') {
    projekt(request, callback)
  }
}
