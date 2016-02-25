'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const X = escapeStringForSql(request.params.X)
  const Y = escapeStringForSql(request.params.Y)

  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        apflora.pop."PopNr",
        apflora.tpop."TPopNr",
        apflora.tpop."TPopId",
        apflora.tpop."TPopFlurname",
        SQRT(
          power(${X} - apflora.tpop."TPopXKoord", 2) +
          power(${Y} - apflora.tpop."TPopYKoord", 2)
        ) AS "DistZuTPop"
      FROM apflora.pop
        INNER JOIN
          apflora.tpop
          ON apflora.pop."PopId" = apflora.tpop."PopId"
      WHERE
        apflora.pop."ApArtId" = ${apId}
        AND apflora.tpop."TPopXKoord" IS NOT NULL
        AND apflora.tpop."TPopYKoord" IS NOT NULL
      ORDER BY
        "DistZuTPop"
      LIMIT 1`
    apfDb.query(sql, (error, result) => {
      callback(error, result.rows)
    })
  })
}
