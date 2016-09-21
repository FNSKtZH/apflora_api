'use strict'

const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  const wert = escapeStringForSql(request.params.wert) // Wert der ID
  const sql = `
    SELECT
      *
    FROM
      apflora.${tabelle}
    WHERE
      "${feld}" = ${wert}`

  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
