'use strict'

/* eslint-disable max-len */

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const berichtjahr = escapeStringForSql(request.params.berichtjahr) || null

  // 1. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  const sqlTpopMitKontrolleImBerjahr = `
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontr."TPopKontrJahr" = ${berichtjahr}`
  // 2. "TPop mit TPopBer im Berichtjahr" ermitteln:
  const sqlTpopMitTpopberImBerjahr = `
    SELECT DISTINCT
      apflora.tpopber."TPopId"
    FROM
      apflora.tpopber
    WHERE
      apflora.tpopber."TPopBerJahr" = ${berichtjahr}`
  // 3. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  const sql = `
    SELECT DISTINCT
      apflora.ap."ProjId",
      apflora.pop."ApArtId",
      'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):' AS hw,
      ARRAY['Projekte', 1 , 'Arten', apflora.ap."ApArtId", 'Populationen', apflora.pop."PopId", 'Teil-Populationen', apflora.tpop."TPopId"]::text[] AS "url"
    FROM
      apflora.ap
      INNER JOIN
        apflora.pop
        INNER JOIN
          apflora.tpop
          ON apflora.pop."PopId" = apflora.tpop."PopId"
      ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpop."TPopApBerichtRelevant" = 1
      AND apflora.tpop."TPopId" IN (${sqlTpopMitKontrolleImBerjahr})
      AND apflora.tpop."TPopId" NOT IN (${sqlTpopMitTpopberImBerjahr})
      AND apflora.pop."ApArtId" = ${apId}`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
