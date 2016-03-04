'use strict'

const pg = require('pg')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  // Daten abfragen
  // get a pg client from the connection pool
  pg.connect(connectionString, (error, apfDb, done) => {
    if (error) {
      if (apfDb) done(apfDb)
      console.log('an error occured when trying to connect to db apflora')
    }
    const sql = `
      SELECT
        ap.ApArtId,
        beob.adb_eigenschaften.Artname,
        ap_umsetzung_werte.DomainTxt AS ApUmsetzung,
        pop.PopId,
        pop.PopNr,
        pop.PopName,
        pop_status_werte.HerkunftTxt AS PopHerkunft,
        pop.PopBekanntSeit,
        tpop.TPopId,
        tpop.TPopFlurname,
        tpop.TPopNr,
        tpop.TPopGemeinde,
        tpop.TPopXKoord,
        tpop.TPopYKoord,
        domPopHerkunft_1.HerkunftTxt AS TPopHerkunft
      FROM (((((ap
        INNER JOIN pop ON ap.ApArtId = pop.ApArtId)
        INNER JOIN tpop ON pop.PopId = tpop.PopId)
        INNER JOIN beob.adb_eigenschaften ON ap.ApArtId = beob.adb_eigenschaften.TaxonomieId)
        LEFT JOIN pop_status_werte ON pop.PopHerkunft = pop_status_werte.HerkunftId)
        LEFT JOIN ap_umsetzung_werte ON ap.ApUmsetzung = ap_umsetzung_werte.DomainCode)
        LEFT JOIN pop_status_werte AS domPopHerkunft_1 ON tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId
      WHERE tpop.TPopXKoord Is Not Null
        AND tpop.TPopYKoord Is Not Null
        AND tpop.TPopId = ${tpopId}`
    apfDb.query(sql, (error, result) => callback(error, result.rows))
  })
}
