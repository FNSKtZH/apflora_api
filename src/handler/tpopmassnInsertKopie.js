'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`../newGuid.js`)

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const tpopMassnId = escapeStringForSql(request.params.tpopMassnId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newTPopMassnId = null

  app.db.tx(function* manageData() {
    // need a statement that selects all fields but some
    // from: http://dba.stackexchange.com/questions/1957/sql-select-all-columns-except-some
    const fieldsListStatement = yield app.db.one(`
      SELECT array_to_string(ARRAY(SELECT '"' || c.column_name || '"'
        FROM information_schema.columns As c
          WHERE table_name = 'tpopmassn'
          AND  c.column_name NOT IN('TPopMassnId', 'TPopMassnGuid')
        ), ',') As sqlstmt
    `)
    const fieldsList = fieldsListStatement.sqlstmt

    newTPopMassnId = yield app.db.one(`
      INSERT INTO
        apflora.tpopmassn (${fieldsList})
      SELECT
        ${fieldsList}
      FROM
        apflora.tpopmassn
      WHERE
        "TPopMassnId" = ${tpopMassnId}
      RETURNING "TPopMassnId"
    `)

    newTPopMassnId = newTPopMassnId.TPopMassnId

    yield app.db.none(`
      UPDATE
        apflora.tpopmassn
      SET
        "TPopId" = ${tpopId},
        "TPopMassnGuid" = ${`'${newGuid()}'`},
        "MutWer" = ${`'${user}'`},
        "MutWann" = ${`'${date}'`}
      WHERE
        "TPopMassnId" = ${newTPopMassnId}
    `)
  })
    // neue id zurück liefern
    .then(() => callback(null, newTPopMassnId))
    .catch(error => callback(error, null))
}
