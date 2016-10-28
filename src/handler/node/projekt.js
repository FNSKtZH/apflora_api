'use strict'

const projektQuery = require(`./projektQuery`)

// TODO: get real user

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  const user = 23

  if (id) {
    id = parseInt(id, 0)
  }

  projektQuery({
    user,
    projId: id,
    children: []
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
