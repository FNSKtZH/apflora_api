'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = (request, callback) => {
  const popId = escapeStringForSql(request.params.popId)

  // Daten abfragen
  connection.query(`
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
      AND pop.PopId = ${popId}`,
    (err, data) => callback(err, data)
  )
}
