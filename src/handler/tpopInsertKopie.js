'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`..//newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newTPopId = null

  app.db.task(function* manageData() {
    // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
    yield app.db.none(`DROP TABLE IF EXISTS tmp`)
    yield app.db.none(`
      CREATE TEMPORARY TABLE
        tmp
      AS SELECT
        *
      FROM
        apflora.tpop
      WHERE
        "TPopId" = ${tpopId}`
    )
    // get new TPopId
    const nextvalRow = yield app.db.one(`select nextval('apflora."tpop_TPopId_seq"')`)
    newTPopId = parseInt(nextvalRow.nextval, 0)
    // TPopId anpassen
    yield app.db.none(`
      UPDATE
        tmp
      SET
        "TPopId" = ${newTPopId},
        "PopId" = ${popId},
        "TPopGuid" = '${newGuid()}',
        "MutWann" = '${date}',
        "MutWer" = '${user}'`
    )
    return yield app.db.none(`
      INSERT INTO
        apflora.tpop
      SELECT
        *
      FROM
        tmp`)
  })
    .then(() => callback(null, newTPopId))
    .catch(error => callback(error, null))
}
