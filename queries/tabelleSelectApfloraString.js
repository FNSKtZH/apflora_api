'use strict'

const pg = require('pg')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten geholt werden sollen
  const feld = escapeStringForSql(request.params.feld) // das ist der Name des Feldes, das verglichen wird
  const wert = escapeStringForSql(request.params.wert) // der Wert im Feld, das verglichen wird

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        *
      FROM
        apflora.${tabelle}
      WHERE
        "${feld}" = '${wert}'`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
