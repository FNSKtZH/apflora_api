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
  var apId = escapeStringForSql(request.params.apId)
  var sql

  sql = [
    'SELECT apflora.ap.ApArtId, apflora_beob.adb_eigenschaften.Artname, apflora.ap_umsetzung_werte.DomainTxt AS ApUmsetzung, apflora.pop.PopId, apflora.pop.PopNr, apflora.pop.PopName, apflora.pop_status_werte.HerkunftTxt AS PopHerkunft, apflora.pop.PopBekanntSeit, apflora.tpop.TPopId, apflora.tpop.TPopFlurname, apflora.tpop.TPopNr, apflora.tpop.TPopGemeinde, apflora.tpop.TPopXKoord, apflora.tpop.TPopYKoord, domPopHerkunft_1.HerkunftTxt AS TPopHerkunft',
    'FROM (((((apflora.ap INNER JOIN apflora.pop ON apflora.ap.ApArtId = apflora.pop.ApArtId) INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) INNER JOIN apflora_beob.adb_eigenschaften ON apflora.ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId) LEFT JOIN apflora.pop_status_werte ON apflora.pop.PopHerkunft = apflora.pop_status_werte.HerkunftId) LEFT JOIN apflora.ap_umsetzung_werte ON apflora.ap.ApUmsetzung = apflora.ap_umsetzung_werte.DomainCode) LEFT JOIN apflora.pop_status_werte AS domPopHerkunft_1 ON apflora.tpop.TPopHerkunft = domPopHerkunft_1.HerkunftId',
    'WHERE apflora.tpop.TPopXKoord Is Not Null AND apflora.tpop.TPopYKoord Is Not Null AND apflora.ap.ApArtId = ' + apId
  ]

  // Daten abfragen
  connection.query(
    sql.join(' '),
    (err, data) => callback(err, data)
  )
}
