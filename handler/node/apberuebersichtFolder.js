'use strict'

const apberuebersichtFolderQuery = require(`./apberuebersichtFolderQuery`)
const projektQuery = require(`./projektQuery`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  const levels = encodeURIComponent(request.query.levels)

  if (id) {
    id = parseInt(id, 0)
  }

  if (levels && levels === `all`) {
    const user = 23
    projektQuery({ user, projId: id, folders: [`apberuebersicht`] })
      .then(nodes => callback(null, nodes))
      .catch(error => callback(error, null))
  } else {
    apberuebersichtFolderQuery(id)
      .then(nodes => callback(null, nodes))
      .catch(error => callback(error, null))
  }
}
