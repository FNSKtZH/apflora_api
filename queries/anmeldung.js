'use strict'

const app = require('ampersand-app')

const escapeStringForSql = require('./escapeStringForSql.js')

module.exports = (request, callback) => {
  const userName = escapeStringForSql(request.params.name)
  const password = escapeStringForSql(request.params.pwd)
  const sql = `
    SELECT
      "NurLesen"
    FROM
      apflora."user"
    WHERE
      "UserName" = '${userName}'
      AND "Passwort" = '${password}'`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
