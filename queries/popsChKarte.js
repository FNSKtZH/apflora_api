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

  // Daten abfragen
  connection.query(
    'SELECT ap.ApArtId, apflora_beob.adb_eigenschaften.Artname, ap_umsetzung_werte.DomainTxt AS ApUmsetzung, pop.PopId, pop.PopNr, pop.PopName, pop_status_werte.HerkunftTxt AS PopHerkunft, pop.PopBekanntSeit, pop.PopXKoord, pop.PopYKoord, pop.PopGuid FROM (((ap INNER JOIN pop ON ap.ApArtId = pop.ApArtId) INNER JOIN apflora_beob.adb_eigenschaften ON ap.ApArtId = apflora_beob.adb_eigenschaften.TaxonomieId) LEFT JOIN pop_status_werte ON pop.PopHerkunft = pop_status_werte.HerkunftId) LEFT JOIN ap_umsetzung_werte ON ap.ApUmsetzung = ap_umsetzung_werte.DomainCode WHERE pop.PopXKoord Is Not Null AND pop.PopYKoord Is Not Null AND ap.ApArtId = ' + apId,
    (err, data) => callback(err, data)
  )
}
