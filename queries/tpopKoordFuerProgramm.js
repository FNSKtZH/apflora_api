'use strict'

const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  // Daten abfragen
  request.pg.client.query(`
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
      AND apflora.pop."ApArtId" = ${apId}`,
    (err, data) => callback(err, data.rows)
  )
}
