'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const userName = request.params.name
  const password = encodeURIComponent(request.params.pwd)
  console.log(`request.params.name:`, request.params.name)
  console.log(`userName:`, userName)
  console.log(`password:`, password)
  const sql = `
    SELECT
      "NurLesen"
    FROM
      apflora."user"
    WHERE
      "UserName" = $1
      AND "Passwort" = $2`

  app.db.any(sql, [userName, password])
    .then((rows) => {
      console.log(`rows:`, rows)
      callback(null, rows)
    })
    .catch(error => callback(error, null))
}
