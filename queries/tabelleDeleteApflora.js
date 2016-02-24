'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten gelöscht werden sollen
  const tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld) // das ist der Name der ID der Tabelle
  const tabelleId = escapeStringForSql(request.params.tabelleId) // der Wert der ID des zu löschenden Datensatzes

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      DELETE FROM
        ${tabelle}
      WHERE
        "${tabelleIdFeld}"" = '${tabelleId}'`
    apfDb.query(sql, (error, result) => {
      if (error) callback(error, null)
      callback(error, result.rows)
    })
  })
}
