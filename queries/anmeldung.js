'use strict'

const app = require('ampersand-app')

module.exports = (request, callback) => {
  const userName = encodeURIComponent(request.params.name)
  const password = encodeURIComponent(request.params.pwd)
  const sql = `
    SELECT
      "NurLesen"
    FROM
      apflora."user"
    WHERE
      "UserName" = $1
      AND "Passwort" = $2`

  app.db.any(sql, [userName, password])
    .then((rows) =>
      callback(null, rows)
    )
    .catch((error) =>
      callback(error, null)
    )
}
