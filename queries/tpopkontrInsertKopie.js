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
  const tpopKontrId = escapeStringForSql(request.params.tpopKontrId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString()                // wann gespeichert wird

  async.series(
    [
      (callback) => {
        // allfällige temporäre Tabelle löschen
        connection.query(
          `DROP TABLE IF EXISTS tmp`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        connection.query(`
          CREATE TEMPORARY TABLE tmp
          SELECT *
          FROM tpopkontr
          WHERE TPopKontrId = ${tpopKontrId}`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // TPopId anpassen
        connection.query(`
          UPDATE tmp
          SET
            TPopKontrId = NULL,
            TPopId = ${tpopId},
            MutWann = "${date}",
            MutWer = "${user}"`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        connection.query(`
          INSERT INTO tpopkontr
          SELECT * FROM tmp`,
          (err, data) => callback(err, data.insertId)
        )
      }
    ],
    (err, results) => {
      const tpopkontridNeu = results[3]

      if (err) { return callback(err, null) }
      // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
      const sql = `
      INSERT INTO tpopkontrzaehl
      (
        Anzahl,
        Zaehleinheit,
        Methode,
        MutWann,
        MutWer,
        TPopKontrId
      )
      SELECT
        tpopkontrzaehl.Anzahl,
        tpopkontrzaehl.Zaehleinheit,
        tpopkontrzaehl.Methode,
        "${date}",
        "${user}",
        ${tpopkontridNeu}
      FROM tpopkontrzaehl
      WHERE tpopkontrzaehl.TPopKontrId = ${tpopKontrId}`
      connection.query(
        sql,
        // neue tpopkontrId zurück liefern
        (err, data) => callback(null, tpopkontridNeu)
      )
    }
  )
}
