'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const apId = escapeStringForSql(request.params.apId)
  const sql = apId ? `SELECT * FROM views.${view} WHERE "ApArtId" = ${apId}` : `SELECT * FROM views.${view}`

  request.pg.client.query(sql, (error, result) => {
    if (error) callback(error, null)
    // null-werte eliminieren
    const data = result.rows
    data.forEach((object) => {
      Object.keys(object).forEach((key) => {
        if (object[key] === null) object[key] = ''
      })
    })
    callback(error, data)
  })
}
