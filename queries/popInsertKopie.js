'use strict'

const pg = require('pg')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird

  // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
  // // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      INSERT INTO apflora.pop (
        "PopNr",
        "PopName",
        "PopHerkunft",
        "PopHerkunftUnklar",
        "PopHerkunftUnklarBegruendung",
        "PopBekanntSeit",
        "PopXKoord",
        "PopYKoord",
        "PopGuid",
        "MutWann",
        "MutWer",
        "ApArtId"
        )
      SELECT
        "PopNr",
        "PopName",
        "PopHerkunft",
        "PopHerkunftUnklar",
        "PopHerkunftUnklarBegruendung",
        "PopBekanntSeit",
        "PopXKoord",
        "PopYKoord",
        "PopGuid",
        "${date}",
        "${user}",
        ${apId}
      FROM apflora.pop
      WHERE "PopId" = ${popId}
      RETURNING apflora.pop."PopId"`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
