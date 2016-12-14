'use strict'

/* eslint-disable max-len */

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const berichtjahr = escapeStringForSql(request.params.berichtjahr) || null

  // 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
  const sqlTpopMitAnsVorBerjahr = `
    SELECT DISTINCT
      apflora.tpopmassn."TPopId"
    FROM
      apflora.tpopmassn
    WHERE
      apflora.tpopmassn."TPopMassnTyp" IN (1, 2, 3)
      AND apflora.tpopmassn."TPopMassnJahr" < ${berichtjahr}`
  // 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  const sqlTpopMitKontrolleImBerjahr = `
    SELECT DISTINCT
      apflora.tpopkontr."TPopId"
    FROM
      apflora.tpopkontr
    WHERE
      apflora.tpopkontr."TPopKontrTyp" NOT IN ('Zwischenziel', 'Ziel')
      AND apflora.tpopkontr."TPopKontrJahr" = ${berichtjahr}`
  // 3. "TPop mit TPopMassnBer im Berichtjahr" ermitteln:
  const sqlTpopMitTpopmassnberImBerjahr = `
    SELECT DISTINCT
      apflora.tpopmassnber."TPopId"
    FROM
      apflora.tpopmassnber
    WHERE
      apflora.tpopmassnber."TPopMassnBerJahr" = ${berichtjahr}`
  // 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  const sql = `
    SELECT DISTINCT
      apflora.ap."ProjId",
      apflora.pop."ApArtId",
      'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):' AS hw,
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
      AND apflora.tpop."TPopId" IN (${sqlTpopMitAnsVorBerjahr})
      AND apflora.tpop."TPopId" IN (${sqlTpopMitKontrolleImBerjahr})
      AND apflora.tpop."TPopId" NOT IN (${sqlTpopMitTpopmassnberImBerjahr})
      AND apflora.pop."ApArtId" = ${apId}`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
