'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten gelöscht werden sollen
  const tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld) // das ist der Name der ID der Tabelle
  const tabelleId = escapeStringForSql(request.params.tabelleId) // der Wert der ID des zu löschenden Datensatzes
  const sql = `
    DELETE FROM
      apflora.${tabelle}
    WHERE
      "${tabelleIdFeld}" = '${tabelleId}'`

  request.pg.client.query(sql, (error, result) => {
    if (error) callback(error, null)
    callback(error, result.rows)
  })
}
