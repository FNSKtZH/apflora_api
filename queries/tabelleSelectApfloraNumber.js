'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  const wert = escapeStringForSql(request.params.wert) // Wert der ID

  connection.query(`
    SELECT *
    FROM ${tabelle}
    WHERE ${feld} = ${wert}`,
    (err, data) => callback(err, data)
  )
}
