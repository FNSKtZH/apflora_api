'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  const wert = escapeStringForSql(request.params.wert) // Wert der ID
  const sql = `
    SELECT
      *
    FROM
      beob.${tabelle}
    WHERE
      "${feld}" = ${wert}`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
