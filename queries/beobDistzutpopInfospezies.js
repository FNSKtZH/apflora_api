'use strict'

const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const beobId = escapeStringForSql(request.params.beobId)
  const sql = `
    SELECT
      beob.beob_infospezies."NO_NOTE",
      beob.beob_infospezies."NO_ISFS",
      apflora.tpop."TPopId",
      beob.beob_infospezies."FNS_XGIS",
      beob.beob_infospezies."FNS_YGIS",
      apflora.tpop."TPopXKoord",
      apflora.tpop."TPopYKoord",
      apflora.pop."PopNr",
      apflora.tpop."TPopNr",
      apflora.tpop."TPopFlurname",
      SQRT(
        power((beob.beob_infospezies."FNS_XGIS" - apflora.tpop."TPopXKoord"), 2) +
        power((beob.beob_infospezies."FNS_YGIS" - apflora.tpop."TPopYKoord"), 2)
      ) AS "DistZuTPop"
    FROM
      beob.beob_infospezies
      INNER JOIN
        (apflora.pop
        INNER JOIN
          apflora.tpop
          ON apflora.pop."PopId" = apflora.tpop."PopId")
        ON beob.beob_infospezies."NO_ISFS" = apflora.pop."ApArtId"
    WHERE
      beob.beob_infospezies."NO_NOTE" = ${beobId}
      AND apflora.tpop."TPopXKoord" IS NOT NULL
      AND apflora.tpop."TPopYKoord" IS NOT NULL
      AND beob.beob_infospezies."FNS_XGIS" IS NOT NULL
      AND beob.beob_infospezies."FNS_YGIS" IS NOT NULL
    ORDER BY
      "DistZuTPop",
      apflora.tpop."TPopFlurname"`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
