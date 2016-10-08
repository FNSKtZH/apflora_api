'use strict'

const apQuery = require(`./apQuery`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  apQuery({ apArtId: id, children: [0] })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
