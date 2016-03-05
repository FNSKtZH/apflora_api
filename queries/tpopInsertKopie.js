'use strict'

const async = require('async')
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird

  async.series(
    [
      (callback) => {
        // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        request.pg.client.query(
          'DROP TABLE IF EXISTS tmp',
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        request.pg.client.query(`
          CREATE TEMPORARY TABLE
            tmp
          SELECT
            *
          FROM
            tpop
          WHERE
            "TPopId" = ${tpopId}`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // TPopId anpassen
        request.pg.client.query(`
          UPDATE
            tmp
          SET
            "TPopId" = NULL,
            "PopId" = ${popId},
            "MutWann" = '${date}',
            "MutWer" = '${user}'`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        request.pg.client.query(`
          INSERT INTO
            tpop
          SELECT
            *
          FROM
            tmp
          RETURNING
            tpop."TPopId"`,
          (err, data) => callback(err, data)
        )
      }
    ],
    // neue id zurück liefern
    (err, results) => callback(err, results[3])
  )
}
