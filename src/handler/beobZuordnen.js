'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)

  const sql = `
    SELECT
      beob.beob_evab."NO_NOTE_PROJET" AS "NO_NOTE",
      beob.beob_evab."NO_ISFS",
      beob.beob_evab."COORDONNEE_FED_E" AS "X",
      beob.beob_evab."COORDONNEE_FED_N" AS "Y",
      beob.beob_evab."A_NOTE",
      beob.beob_bereitgestellt."Datum" AS "Datum",
      beob.beob_bereitgestellt."Autor",
      beob.beob_evab."Projekt_ZH" AS "PROJET",
      beob.beob_evab."DESC_LOCALITE_" AS "DESC_LOCALITE",
      apflora.beobzuordnung."TPopId",
      CONCAT(apflora.pop."PopNr", '/', apflora.tpop."TPopNr") AS popTpopNr
    FROM
      (((beob.beob_bereitgestellt
      INNER JOIN
        beob.beob_evab
        ON beob.beob_bereitgestellt."NO_NOTE_PROJET" = beob.beob_evab."NO_NOTE_PROJET")
      LEFT JOIN
        apflora.beobzuordnung
        ON beob.beob_evab."NO_NOTE_PROJET" = apflora.beobzuordnung."NO_NOTE")
      LEFT JOIN
        apflora.tpop
        ON apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId")
      LEFT JOIN
        apflora.pop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
    WHERE
      beob.beob_evab."COORDONNEE_FED_E" > 0
      AND beob.beob_evab."COORDONNEE_FED_N" > 0
      AND apflora.beobzuordnung."BeobNichtZuordnen" Is Null
      AND beob.beob_evab."NO_ISFS" = ${apId}
    UNION SELECT
      to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999'),
      beob.beob_infospezies."NO_ISFS",
      beob.beob_infospezies."FNS_XGIS" AS "X",
      beob.beob_infospezies."FNS_YGIS" AS "Y",
      to_char(beob.beob_infospezies."A_NOTE", 'FM9999999'),
      beob.beob_bereitgestellt."Datum" AS "Datum",
      beob.beob_bereitgestellt."Autor",
      beob.beob_infospezies."PROJET",
      beob.beob_infospezies."DESC_LOCALITE",
      apflora.beobzuordnung."TPopId",
      CONCAT(apflora.tpop."TPopNr", '/', apflora.pop."PopNr") AS "popTpopNr"
    FROM
      (((beob.beob_infospezies
      INNER JOIN
        beob.beob_bereitgestellt
        ON beob.beob_infospezies."NO_NOTE" = beob.beob_bereitgestellt."NO_NOTE")
      LEFT JOIN
        apflora.beobzuordnung
        ON to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') = apflora.beobzuordnung."NO_NOTE")
      LEFT JOIN
        apflora.tpop
        ON apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId")
      LEFT JOIN
        apflora.pop
        ON apflora.tpop."PopId" = apflora.pop."PopId"
    WHERE
      beob.beob_infospezies."FNS_XGIS" > 0
      AND beob.beob_infospezies."FNS_YGIS" > 0
      AND apflora.beobzuordnung."BeobNichtZuordnen" Is Null
      AND beob.beob_infospezies."NO_ISFS" = ${apId}
    ORDER BY
      "Datum" DESC`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
