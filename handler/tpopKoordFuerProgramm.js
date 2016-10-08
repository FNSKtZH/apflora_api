'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)

  const sql = `
    SELECT DISTINCT
      apflora.pop."ApArtId",
      apflora.pop."PopId",
      apflora.pop."PopNr",
      apflora.tpop."TPopId",
      apflora.tpop."TPopNr",
      apflora.tpop."TPopXKoord",
      apflora.tpop."TPopYKoord",
      apflora.tpop."TPopApBerichtRelevant"
    FROM
      apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    WHERE
      apflora.tpop."TPopXKoord" Is Not Null
      AND apflora.tpop."TPopYKoord" Is Not Null
      AND apflora.pop."ApArtId" = ${apId}`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
