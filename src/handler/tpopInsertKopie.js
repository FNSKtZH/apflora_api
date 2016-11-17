'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`../newGuid.js`)
let newTPopId

module.exports = (request, callback) => {
  const tpopId = escapeStringForSql(request.params.tpopId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird

  app.db.tx(function* manageData() {
    // need a statement that selects all fields but some
    // from: http://dba.stackexchange.com/questions/1957/sql-select-all-columns-except-some
    const fieldsListStatement = yield app.db.one(`
      SELECT array_to_string(ARRAY(SELECT '"' || c.column_name || '"'
        FROM information_schema.columns As c
          WHERE table_name = 'tpop'
          AND  c.column_name NOT IN('TPopId', 'TPopNr', 'TPopGuid')
        ), ',') As sqlstmt
    `)
    const fieldsList = fieldsListStatement.sqlstmt

    newTPopId = yield app.db.one(`
      INSERT INTO
        apflora.tpop (${fieldsList})
      SELECT
        ${fieldsList}
      FROM
        apflora.tpop
      WHERE
        "TPopId" = ${tpopId}
      RETURNING "TPopId"
    `)

    newTPopId = newTPopId.TPopId

    return yield app.db.none(`
      UPDATE
        apflora.tpop
      SET
        "PopId" = ${popId},
        "TPopGuid" = ${`'${newGuid()}'`},
        "MutWer" = ${`'${user}'`},
        "MutWann" = ${`'${date}'`}
      WHERE
        "TPopId" = ${newTPopId}
    `)
  })
    .then(() => callback(null, newTPopId))
    .catch(error => callback(error, null))
}
