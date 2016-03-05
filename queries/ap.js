'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const sql = `
    SELECT
      apflora.ap."ApArtId",
      beob.adb_eigenschaften."Artname",
      apflora.ap."ApStatus",
      apflora.ap."ApJahr",
      apflora.ap."ApUmsetzung",
      apflora.ap."ApBearb",
      apflora.ap."ApArtwert",
      apflora.ap."MutWann",
      apflora.ap."MutWer"
    FROM
      apflora.ap
      INNER JOIN
        beob.adb_eigenschaften
        ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
    WHERE
      apflora.ap."ApArtId" = ${apId}`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
