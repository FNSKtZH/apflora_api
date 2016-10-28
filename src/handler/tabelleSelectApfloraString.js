'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // das ist der Name des Feldes, das verglichen wird
  const wert = escapeStringForSql(request.params.wert) // der Wert im Feld, das verglichen wird
  const sql = `
    SELECT
      *
    FROM
      apflora.${tabelle}
    WHERE
      "${feld}" = '${wert}'`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
