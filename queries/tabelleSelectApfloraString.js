'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // das ist der Name des Feldes, das verglichen wird
  const wert = escapeStringForSql(request.params.wert) // der Wert im Feld, das verglichen wird

  connection.query(`
    SELECT *
    FROM ${tabelle}
    WHERE ${feld} = "${wert}"`,
    (err, data) => callback(err, data)
  )
}
