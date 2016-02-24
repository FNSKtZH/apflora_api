'use strict'

/*
 * need to test this with postgresql
 */

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const user = escapeStringForSql(request.params.user)
  const date = new Date().toISOString()

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    // neuen AP einfügen
    apfDb.query(`
      INSERT INTO
        apflora.ap ("ApArtId", "MutWann", "MutWer")
      VALUES
        (${apId}, '${date}', '${user}')
      ON CONFLICT DO NOTHING`,
      (err, data) => {
        if (err) callback(err, null)
        // Artwert holen
        apfDb.query(`
          SELECT
            "Artwert"
          FROM
            beob.adb_eigenschaften
          WHERE
            "TaxonomieId" = ${apId}`,
          (err, data) => {
            // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
            if (data && data[0]) {
              const artwert = data[0]
              if (artwert) {
                apfDb.query(`
                  UPDATE
                    apflora.ap
                  SET
                    "ApArtwert" = '${artwert}'
                  WHERE
                    "ApArtId" = ${apId}`,
                  (err, data) => callback(err, apId)
                )
              }
            } else {
              callback(err, null)
            }
          }
        )
      }
    )
  })
}
