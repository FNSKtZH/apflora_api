'use strict'

const async = require('async')
const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopKontrId = escapeStringForSql(request.params.tpopKontrId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString()                // wann gespeichert wird
  let newTPopKontrId = null

  async.series(
    [
      (callback) => {
        // allfällige temporäre Tabelle löschen
        request.pg.client.query(
          'DROP TABLE IF EXISTS tmp',
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
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
            apflora.tpopkontr
          WHERE
            "TPopKontrId" = ${tpopKontrId}`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        // get new TPopKontrId
        request.pg.client.query(`
          select nextval('apflora."tpopkontr_TPopKontrId_seq"')`,
          (err, result) => {
            newTPopKontrId = parseInt(result.rows[0].nextval, 0)
            callback(err, newTPopKontrId)
          }
        )
      },
      (callback) => {
        // TPopId anpassen
        request.pg.client.query(`
          UPDATE tmp
          SET
            "TPopKontrId" = ${newTPopKontrId},
            "TPopId" = ${tpopId},
            "MutWann" = '${date}',
            "MutWer" = '${user}'`,
          // nur allfällige Fehler weiterleiten
          (err) => callback(err, null)
        )
      },
      (callback) => {
        request.pg.client.query(`
          INSERT INTO
            apflora.tpopkontr
          SELECT
            *
          FROM
            tmp`,
          (err, data) => callback(err, null)
        )
      }
    ],
    (err, results) => {
      const tpopkontridNeu = results[2]

      if (err) { return callback(err, null) }
      // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
      const sql = `
      INSERT INTO
        apflora.tpopkontrzaehl
      (
        "Anzahl",
        "Zaehleinheit",
        "Methode",
        "MutWann",
        "MutWer",
        "TPopKontrId"
      )
      SELECT
        apflora.tpopkontrzaehl."Anzahl",
        apflora.tpopkontrzaehl."Zaehleinheit",
        apflora.tpopkontrzaehl."Methode",
        '${date}',
        '${user}',
        ${tpopkontridNeu}
      FROM
        apflora.tpopkontrzaehl
      WHERE
        apflora.tpopkontrzaehl."TPopKontrId" = ${tpopKontrId}`
      request.pg.client.query(
        sql,
        // neue tpopkontrId zurück liefern
        (err, data) => callback(null, tpopkontridNeu)
      )
    }
  )
}
