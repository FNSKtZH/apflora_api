'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`./escapeStringForSql`)
const newGuid = require(`../src/newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopMassnId = escapeStringForSql(request.params.tpopMassnId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newTPopMassnId = null

  app.db.task(function* manageData() {
    // allfällige temporäre Tabelle löschen
    yield app.db.none(`DROP TABLE IF EXISTS tmp`)
    // temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
    yield app.db.none(`
      CREATE TEMPORARY TABLE
        tmp
      AS SELECT
        *
      FROM
        apflora.tpopmassn
      WHERE
        "TPopMassnId" = ${tpopMassnId}`
    )
    // get new TPopMassnId
    const nextvalRow = yield app.db.one(`select nextval('apflora."tpopmassn_TPopMassnId_seq"')`)
    newTPopMassnId = parseInt(nextvalRow.nextval, 0)
    // TPopId anpassen
    yield app.db.none(`
      UPDATE
        tmp
      SET
        "TPopMassnId" = ${newTPopMassnId},
        "TPopMassnGuid" = '${newGuid()}',
        "TPopId" = ${tpopId},
        "MutWann" = '${date}',
        "MutWer" = '${user}'`
    )
    return yield app.db.none(`
      INSERT INTO
        apflora.tpopmassn
      SELECT
        *
      FROM
        tmp`
    )
  })
    // neue id zurück liefern
    .then(() => callback(null, newTPopMassnId))
    .catch(error => callback(error, null))
}
