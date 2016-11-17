'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`../newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopKontrId = escapeStringForSql(request.params.tpopKontrId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString()                // wann gespeichert wird
  let newTPopKontrId = null

  app.db.tx(function* manageData() {
    // need a statement that selects all fields but some
    // from: http://dba.stackexchange.com/questions/1957/sql-select-all-columns-except-some
    const fieldsListStatement = yield app.db.one(`
      SELECT array_to_string(ARRAY(SELECT '"' || c.column_name || '"'
        FROM information_schema.columns As c
          WHERE table_name = 'tpopkontr'
          AND  c.column_name NOT IN('TPopKontrId', 'TPopKontrGuid')
        ), ',') As sqlstmt
    `)
    const fieldsList = fieldsListStatement.sqlstmt

    newTPopKontrId = yield app.db.one(`
      INSERT INTO
        apflora.tpopkontr (${fieldsList})
      SELECT
        ${fieldsList}
      FROM
        apflora.tpopkontr
      WHERE
        "TPopKontrId" = ${tpopKontrId}
      RETURNING "TPopKontrId"
    `)

    newTPopKontrId = newTPopKontrId.TPopKontrId

    yield app.db.none(`
      UPDATE
        apflora.tpopkontr
      SET
        "TPopId" = ${tpopId},
        "TPopKontrGuid" = ${`'${newGuid()}'`},
        "MutWer" = ${`'${user}'`},
        "MutWann" = ${`'${date}'`}
      WHERE
        "TPopKontrId" = ${newTPopKontrId}
    `)

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
