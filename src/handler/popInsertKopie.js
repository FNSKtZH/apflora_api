'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)
const newGuid = require(`../newGuid.js`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let newPopId

  app.db.tx(function* manageData() {
    // need a statement that selects all fields but some
    // from: http://dba.stackexchange.com/questions/1957/sql-select-all-columns-except-some
    const fieldsListStatement = yield app.db.one(`
      SELECT array_to_string(ARRAY(SELECT '"' || c.column_name || '"'
        FROM information_schema.columns As c
          WHERE table_name = 'pop'
          AND  c.column_name NOT IN('PopId', 'PopNr', 'PopGuid')
        ), ',') As sqlstmt
    `)
    const fieldsList = fieldsListStatement.sqlstmt

    newPopId = yield app.db.one(`
      INSERT INTO
        apflora.pop (${fieldsList})
      SELECT
        ${fieldsList}
      FROM
        apflora.pop
      WHERE
        "PopId" = ${popId}
      RETURNING "PopId"
    `)

    newPopId = newPopId.PopId

    return yield app.db.none(`
      UPDATE
        apflora.pop
      SET
        "ApArtId" = ${apId},
        "PopGuid" = ${`'${newGuid()}'`},
        "MutWer" = ${`'${user}'`},
        "MutWann" = ${`'${date}'`}
      WHERE
        "PopId" = ${newPopId}
    `)
  })
    .then(row => callback(null, newPopId))
    .catch(error => callback(error, null))
}
