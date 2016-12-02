'use strict'

const app = require(`ampersand-app`)
const isNumber = require(`../isNumber`)

module.exports = (request, callback) => {
  const schema = encodeURIComponent(request.params.schema)
  const table = encodeURIComponent(request.params.table)
  const field = encodeURIComponent(request.params.field)
  const value = encodeURIComponent(request.params.value)
  let valueSql = `'${value}'`
  if (isNumber(value)) {
    valueSql = value
  }
  const sql = `
    SELECT
      *
    FROM
      ${schema}.${table}
    WHERE
      "${field}" = ${valueSql}`

  app.db.manyOrNone(sql)
    .then((rows) => {
      callback(null, rows)
    })
    .catch(error => callback(error, null))
}
