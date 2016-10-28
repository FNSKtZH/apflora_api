'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)

  const sql = `
    SELECT
      apflora.ap."ApArtId",
      beob.adb_eigenschaften."Artname",
      apflora.ap_umsetzung_werte."DomainTxt" AS "ApUmsetzung",
      apflora.pop."PopId",
      apflora.pop."PopNr",
      apflora.pop."PopName",
      apflora.pop_status_werte."HerkunftTxt" AS "PopHerkunft",
      apflora.pop."PopBekanntSeit",
      apflora.pop."PopXKoord",
      apflora.pop."PopYKoord",
      apflora.pop."PopGuid"
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
      AND apflora.ap."ApArtId" = $1`

  app.db.any(sql, apId)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
