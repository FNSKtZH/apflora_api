'use strict'

const async = require('async')
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newTPopId = null

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
          AS SELECT
            *
          FROM
            apflora.tpop
          WHERE
            "TPopId" = ${tpopId}`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // get new TPopId
        request.pg.client.query(`
          select nextval('apflora."tpop_TPopId_seq"')`,
          (err, result) => {
            newTPopId = parseInt(result.rows[0].nextval, 0)
            callback(err, newTPopId)
          }
        )
      },
      (callback) => {
        // TPopId anpassen
        request.pg.client.query(`
          UPDATE
            tmp
          SET
            "TPopId" = ${newTPopId},
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
            apflora.tpop
          SELECT
            *
          FROM
            tmp`,
          (err, data) => callback(err, null)
        )
      }
    ],
    // neue id zurück liefern
    (err, results) => callback(err, results[2])
  )
}
