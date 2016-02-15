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
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  let sql
  const programm = escapeStringForSql(request.params.programm)

  // url setzen
  switch (programm) {
    case 'programmAp':
      sql = `
        SELECT
          beob.adb_eigenschaften.Artname AS label,
          beob.adb_eigenschaften.TaxonomieId AS id
        FROM beob.adb_eigenschaften
          INNER JOIN apflora.ap ON beob.adb_eigenschaften.TaxonomieId=apflora.ap.ApArtId
        WHERE apflora.ap.ApStatus BETWEEN 1 AND 3
        ORDER BY label`
      break
    case 'programmNeu':
      sql = `
        SELECT
          IF(
            beob.adb_eigenschaften.Status NOT LIKE 'akzeptierter Name',
            CONCAT(beob.adb_eigenschaften.Artname, ' (', beob.adb_eigenschaften.Status, ')'),
            beob.adb_eigenschaften.Artname
          ) AS label,
          beob.adb_eigenschaften.TaxonomieId AS id
        FROM beob.adb_eigenschaften
        WHERE beob.adb_eigenschaften.TaxonomieId NOT IN (SELECT apflora.ap.ApArtId FROM apflora.ap)
        ORDER BY label`
      break
    // 'programmAlle' ist auch default
    default:
      sql = `
        SELECT
          beob.adb_eigenschaften.Artname AS label,
          beob.adb_eigenschaften.TaxonomieId AS id
        FROM beob.adb_eigenschaften
          INNER JOIN apflora.ap ON beob.adb_eigenschaften.TaxonomieId=apflora.ap.ApArtId
        ORDER BY label`
      break
  }

  // Daten abfragen
  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
