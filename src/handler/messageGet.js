'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const id = encodeURIComponent(request.params.id)
  const sql = `
    SELECT
      *
    FROM
      apflora.message
    WHERE
      apflora.message.active = 'true'`

  app.db
    .many(sql, id)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
