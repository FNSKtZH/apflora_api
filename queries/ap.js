'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)
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
      apflora.ap."ApArtId" = $1`

  app.db.many(sql, apId)
    .then(rows =>
      callback(null, rows)
    )
    .catch(error =>
      callback(error, null)
    )
}
