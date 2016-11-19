'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const schema = encodeURIComponent(request.params.schema)
  const table = encodeURIComponent(request.params.table)
  const sql = `
    SELECT
      *
    FROM
      ${schema}.${table}`

  app.db.many(sql)
    .then((rows) => {
      callback(null, rows)
    })
    .catch(error => callback(error, null))
}
