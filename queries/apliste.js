'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  let sql
  const programm = escapeStringForSql(request.params.programm)
  // url setzen
  switch (programm) {
    case 'programmAp':
      sql = `
        SELECT
          beob.adb_eigenschaften."Artname" AS label,
          beob.adb_eigenschaften."TaxonomieId" AS id
        FROM
          beob.adb_eigenschaften
          INNER JOIN
            apflora.ap
            ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
        WHERE
          apflora.ap."ApStatus" BETWEEN 1 AND 3
        ORDER BY
          label`
      break
    case 'programmNeu':
      sql = `
        SELECT
          CASE
            WHEN beob.adb_eigenschaften."Status" NOT LIKE 'akzeptierter Name'
            THEN CONCAT(beob.adb_eigenschaften."Artname", ' (', beob.adb_eigenschaften."Status", ')')
            ELSE beob.adb_eigenschaften."Artname"
          END AS label,
          beob.adb_eigenschaften."TaxonomieId" AS id
        FROM
          beob.adb_eigenschaften
        WHERE
          beob.adb_eigenschaften."TaxonomieId" NOT IN (SELECT apflora.ap."ApArtId" FROM apflora.ap)
        ORDER BY
          label`
      break
    // 'programmAlle' ist auch default
    default:
      sql = `
        SELECT
          beob.adb_eigenschaften."Artname" AS label,
          beob.adb_eigenschaften."TaxonomieId" AS id
        FROM beob.adb_eigenschaften
          INNER JOIN
            apflora.ap
            ON beob.adb_eigenschaften."TaxonomieId" = apflora.ap."ApArtId"
        ORDER BY
          label`
      break
  }
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
