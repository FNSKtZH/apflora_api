'use strict'

const mysql = require('mysql')
const async = require('async')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird

  async.series(
    [
      (callback) => {
        // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        connection.query(
          `DROP TABLE IF EXISTS tmp`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        connection.query(`
          CREATE TEMPORARY TABLE tmp
          SELECT *
          FROM tpop
          WHERE TPopId = ${tpopId}`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // TPopId anpassen
        connection.query(`
          UPDATE tmp
          SET
            TPopId = NULL,
            PopId = ${popId},
            MutWann = "${date}",
            MutWer = "${user}"`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        connection.query(`
          INSERT INTO tpop
          SELECT *
          FROM tmp`,
          (err, data) => callback(err, data.insertId)
        )
      }
    ],
    // neue id zurück liefern
    (err, results) => callback(err, results[3])
  )
}
