'use strict'

var mysql = require('mysql'),
  config = require('../configuration'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  var sql
  var programm = request.params.programm

  // url setzen
  switch (programm) {
    case 'programmAp':
      sql = 'SELECT apflora_beob.adb_eigenschaften.Artname AS label, apflora_beob.adb_eigenschaften.TaxonomieId AS id FROM apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId=apflora.ap.ApArtId WHERE apflora.ap.ApStatus BETWEEN 1 AND 3 ORDER BY label'
      break
    case 'programmNeu':
      sql = "SELECT IF(apflora_beob.adb_eigenschaften.Status NOT LIKE 'akzeptierter Name', CONCAT(apflora_beob.adb_eigenschaften.Artname, ' (', apflora_beob.adb_eigenschaften.Status, ')'), apflora_beob.adb_eigenschaften.Artname) AS label, apflora_beob.adb_eigenschaften.TaxonomieId AS id FROM apflora_beob.adb_eigenschaften WHERE apflora_beob.adb_eigenschaften.TaxonomieId not in (SELECT apflora.ap.ApArtId FROM apflora.ap) ORDER BY label"
      break
    // 'programmAlle' ist auch default
    default:
      sql = 'SELECT apflora_beob.adb_eigenschaften.Artname AS label, apflora_beob.adb_eigenschaften.TaxonomieId AS id FROM apflora_beob.adb_eigenschaften INNER JOIN apflora.ap ON apflora_beob.adb_eigenschaften.TaxonomieId=apflora.ap.ApArtId ORDER BY label'
      break
  }

  // Daten abfragen
  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
