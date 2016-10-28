'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`..//newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopKontrId = escapeStringForSql(request.params.tpopKontrId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString()                // wann gespeichert wird
  let newTPopKontrId = null

  app.db.tx(function* manageData() {
    // allfällige temporäre Tabelle löschen
    yield app.db.none(`DROP TABLE IF EXISTS tmp`)
    // temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
    yield app.db.none(`
      CREATE TEMPORARY TABLE
        tmp
      AS SELECT
        *
      FROM
        apflora.tpopkontr
      WHERE
        "TPopKontrId" = ${tpopKontrId}`
    )
    // get new TPopKontrId
    const nextvalRow = yield app.db.one(`select nextval('apflora."tpopkontr_TPopKontrId_seq"')`)
    newTPopKontrId = parseInt(nextvalRow.nextval, 0)
    // TPopId anpassen
    yield app.db.none(`
      UPDATE tmp
      SET
        "TPopKontrId" = ${newTPopKontrId},
        "TPopId" = ${tpopId},
        "TPopKontrGuid" = '${newGuid()}',
        "MutWann" = '${date}',
        "MutWer" = '${user}'`
    )
    yield app.db.none(`
      INSERT INTO
        apflora.tpopkontr
      SELECT
        *
      FROM
        tmp`
    )
    // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
    return yield app.db.none(`
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
        ${newTPopKontrId}
      FROM
        apflora.tpopkontrzaehl
      WHERE
        apflora.tpopkontrzaehl."TPopKontrId" = ${tpopKontrId}`
    )
  })
    .then(() => callback(null, newTPopKontrId))
    .catch(error => callback(error, null))
}
