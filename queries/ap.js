'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        apflora.ap."ApArtId",
        beob.adb_eigenschaften."Artname",
        apflora.ap."ApStatus",
        apflora.ap."ApJahr",
        apflora.ap."ApUmsetzung",
        apflora.ap."ApBearb",
        apflora.ap."ApArtwert",
        apflora.ap."MutWann",
        apflora.ap."MutWer"
      FROM
        apflora.ap
        INNER JOIN
          beob.adb_eigenschaften
          ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      WHERE
        apflora.ap."ApArtId" = ${apId}`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
