'use strict'

const escapeStringForSql = require(`./escapeStringForSql`)

module.exports = (request, callback) => {
  const popId = escapeStringForSql(request.params.popId)
  const sql = `
    SELECT
      ap."ApArtId",
      beob.adb_eigenschaften."Artname",
      ap_umsetzung_werte."DomainTxt" AS "ApUmsetzung",
      pop."PopId",
      pop."PopNr",
      pop."PopName",
      pop_status_werte."HerkunftTxt" AS "PopHerkunft",
      pop."PopBekanntSeit",
      pop."PopXKoord",
      pop."PopYKoord",
      pop."PopGuid"
    FROM
      (((apflora.ap
      INNER JOIN
        apflora.pop
        ON apflora.ap."ApArtId" = apflora.pop."ApArtId")
      INNER JOIN
        beob.adb_eigenschaften
        ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId")
      LEFT JOIN
        apflora.pop_status_werte
        ON apflora.pop."PopHerkunft" = apflora.pop_status_werte."HerkunftId")
      LEFT JOIN
        apflora.ap_umsetzung_werte
        ON apflora.ap."ApUmsetzung" = apflora.ap_umsetzung_werte."DomainCode"
    WHERE
      apflora.pop."PopXKoord" Is Not Null
      AND apflora.pop."PopYKoord" Is Not Null
      AND apflora.pop."PopId" = ${popId}`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
