'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const idName = escapeStringForSql(request.params.idName) // name des Felds, für den ID's übergeben werden
  const idListe = escapeStringForSql(request.params.idListe) // liste der ID's
  const sql = `
    SELECT
      *
    FROM
      views.${view}
    WHERE
      "${idName}" IN (${idListe})`

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
