'use strict'

const async = require(`async`)
const escapeStringForSql = require(`./escapeStringForSql`)
const newGuid = require(`../src/newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopMassnId = escapeStringForSql(request.params.tpopMassnId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newTPopMassnId = null

  async.series(
    [
      (callback) => {
        // allfällige temporäre Tabelle löschen
        request.pg.client.query(
          `DROP TABLE IF EXISTS tmp`,
          // nur allfällige Fehler weiterleiten
          err => callback(err, null)
        )
      },
      (callback) => {
        // temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
        request.pg.client.query(`
          CREATE TEMPORARY TABLE
            tmp
          AS SELECT
            *
          FROM
            apflora.tpopmassn
          WHERE
            "TPopMassnId" = ${tpopMassnId}`,
          // nur allfällige Fehler weiterleiten
          err => callback(err, null)
        )
      },
      (callback) => {
        // get new TPopMassnId
        request.pg.client.query(`
          select nextval('apflora."tpopmassn_TPopMassnId_seq"')`,
          (err, result) => {
            newTPopMassnId = parseInt(result.rows[0].nextval, 0)
            callback(err, newTPopMassnId)
          }
        )
      },
      (callback) => {
        // TPopId anpassen
        request.pg.client.query(`
          UPDATE
            tmp
          SET
            "TPopMassnId" = ${newTPopMassnId},
            "TPopMassnGuid" = '${newGuid()}',
            "TPopId" = ${tpopId},
            "MutWann" = '${date}',
            "MutWer" = '${user}'`,
          // nur allfällige Fehler weiterleiten
          err => callback(err, null)
        )
      },
      (callback) => {
        request.pg.client.query(`
          INSERT INTO
            apflora.tpopmassn
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
