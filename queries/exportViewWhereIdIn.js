'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const idName = escapeStringForSql(request.params.idName) // name des Felds, für den ID's übergeben werden
  const idListe = escapeStringForSql(request.params.idListe) // liste der ID's
  const sql = `
    SELECT *
    FROM views.${view}
    WHERE "${idName}" IN (${idListe})`

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    apfDb.query(sql, (err, result) => {
      if (err) callback(err, null)
      const data = result.rows
      // null-werte eliminieren
      data.forEach((object) => {
        Object.keys(object).forEach((key) => {
          if (object[key] === null) object[key] = ''
        })
      })
      callback(err, data)
    })
  })
}
