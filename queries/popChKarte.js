'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const popId = escapeStringForSql(request.params.popId)

  // Daten abfragen
  connection.query(
    `SELECT
      ap.ApArtId,
      beob.adb_eigenschaften.Artname,
      ap_umsetzung_werte.DomainTxt AS ApUmsetzung,
      pop.PopId,
      pop.PopNr,
      pop.PopName,
      pop_status_werte.HerkunftTxt AS PopHerkunft,
      pop.PopBekanntSeit,
      pop.PopXKoord,
      pop.PopYKoord,
      pop.PopGuid
    FROM (((ap
      INNER JOIN pop ON ap.ApArtId = pop.ApArtId)
      INNER JOIN beob.adb_eigenschaften ON ap.ApArtId = beob.adb_eigenschaften.TaxonomieId)
      LEFT JOIN pop_status_werte ON pop.PopHerkunft = pop_status_werte.HerkunftId)
      LEFT JOIN ap_umsetzung_werte ON ap.ApUmsetzung = ap_umsetzung_werte.DomainCode
    WHERE pop.PopXKoord Is Not Null
      AND pop.PopYKoord Is Not Null
      AND pop.PopId = ${popId}`,
    (err, data) => callback(err, data)
  )
}
