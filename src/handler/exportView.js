'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const apId = escapeStringForSql(request.params.apId)
  const sql = apId ? `SELECT * FROM views.${view} WHERE "ApArtId" = ${apId}` : `SELECT * FROM views.${view}`

  app.db.any(sql)
    .then((rows) => {
      // null-werte eliminieren
      rows.forEach((object) => {
        Object.keys(object).forEach((key) => {
          if (object[key] === null) object[key] = ``
        })
      })
      callback(null, rows)
    })
    .catch(error => callback(error, null))
}
