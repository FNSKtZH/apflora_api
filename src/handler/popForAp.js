'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const apArtId = escapeStringForSql(request.params.apArtId)

  const sql = `
    SELECT
      apflora.pop.*
    FROM
      apflora.ap
      INNER JOIN
        apflora.pop
        ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
    WHERE
      apflora.ap."ApArtId" = $1`

  app.db.any(sql, apArtId)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
