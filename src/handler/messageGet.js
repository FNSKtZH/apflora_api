'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      *
    FROM
      apflora.message
    WHERE
      apflora.message.active = 'true'`

  app.db
    .many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
