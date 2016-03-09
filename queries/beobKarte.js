'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const tpopId = escapeStringForSql(request.params.tpopId)
  const beobId = escapeStringForSql(request.params.beobId)
  const nichtZuzuordnen = escapeStringForSql(request.params.nichtZuzuordnen)
  let sql

  if (beobId) {
    // beobid wurde übergeben > auf eine Beobachtung filtern
    if (isNaN(beobId)) {
      sql = `
        SELECT
          beob_evab."NO_NOTE_PROJET" AS "NO_NOTE",
          beob_evab."NO_ISFS",
          beob_evab."COORDONNEE_FED_E" AS "X",
          beob_evab."COORDONNEE_FED_N" AS "Y",
          beob_evab."A_NOTE",
          beob_bereitgestellt."Datum" AS "Datum",
          beob_bereitgestellt."Autor",
          beob_evab."Projekt_ZH" AS "PROJET",
          beob_evab."DESC_LOCALITE_" AS "DESC_LOCALITE"
        FROM
          beob.beob_bereitgestellt
          INNER JOIN
            beob.beob_evab
            ON beob_bereitgestellt."NO_NOTE_PROJET" = beob_evab."NO_NOTE_PROJET"
        WHERE
          beob_evab."COORDONNEE_FED_E" > 0
          AND beob_evab."COORDONNEE_FED_N" > 0
          AND beob_evab."NO_NOTE_PROJET" = '${beobId}'
        ORDER BY
          "Datum" DESC
        LIMIT 100`
    } else {
      sql = `
        SELECT
          to_char(beob_infospezies."NO_NOTE", 'FM9999999') AS "NO_NOTE",
          beob_infospezies."NO_ISFS",
          beob_infospezies."FNS_XGIS" AS "X",
          beob_infospezies."FNS_YGIS" AS "Y",
          to_char(beob_infospezies."A_NOTE", 'FM9999999') AS "A_NOTE",
          beob_bereitgestellt."Datum" AS "Datum",
          beob_bereitgestellt."Autor",
          beob_infospezies."PROJET",
          beob_infospezies."DESC_LOCALITE"
        FROM
          beob.beob_infospezies
          INNER JOIN
            beob.beob_bereitgestellt
            ON beob_infospezies."NO_NOTE" = beob_bereitgestellt."NO_NOTE"
        WHERE
          beob_infospezies."FNS_XGIS" > 0
          AND beob_infospezies."FNS_YGIS" > 0
          AND beob_infospezies."NO_NOTE" = ${beobId}`
    }
  } else if (tpopId) {
    // tpopId wurde übergeben > auf tpop filtern
    sql = `
      SELECT
        to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') AS "NO_NOTE",
        beob.beob_infospezies."NO_ISFS",
        beob.beob_infospezies."FNS_XGIS" AS "X",
        beob.beob_infospezies."FNS_YGIS" AS "Y",
        to_char(beob.beob_infospezies."A_NOTE", 'FM9999999') AS "A_NOTE",
        beob.beob_bereitgestellt."Datum" AS "Datum",
        beob.beob_bereitgestellt."Autor",
        beob.beob_infospezies."PROJET",
        beob.beob_infospezies."DESC_LOCALITE",
        apflora.beobzuordnung."TPopId",
        apflora.tpop."TPopXKoord",
        apflora.tpop."TPopYKoord"
      FROM
        (beob.beob_infospezies
        INNER JOIN
          beob.beob_bereitgestellt
          ON beob.beob_infospezies."NO_NOTE" = beob.beob_bereitgestellt."NO_NOTE")
        INNER JOIN
          (apflora.tpop
          INNER JOIN
            apflora.beobzuordnung
            ON apflora.tpop."TPopId" = apflora.beobzuordnung."TPopId")
          ON to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') = apflora.beobzuordnung."NO_NOTE"
      WHERE
        beob.beob_infospezies."FNS_XGIS" > 0
        AND beob.beob_infospezies."FNS_YGIS" > 0
        AND apflora.beobzuordnung."TPopId" = ${tpopId}
      UNION SELECT
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
        apflora.tpop."TPopXKoord",
        apflora.tpop."TPopYKoord"
      FROM
        (beob.beob_bereitgestellt
        INNER JOIN
          beob.beob_evab
          ON beob.beob_bereitgestellt."NO_NOTE_PROJET" = beob.beob_evab."NO_NOTE_PROJET")
        INNER JOIN
          (apflora.tpop
          INNER JOIN
            apflora.beobzuordnung
            ON apflora.tpop."TPopId" = apflora.beobzuordnung."TPopId")
          ON beob.beob_evab."NO_NOTE_PROJET" = apflora.beobzuordnung."NO_NOTE"
      WHERE
        beob.beob_evab."COORDONNEE_FED_E" > 0
        AND beob.beob_evab."COORDONNEE_FED_N" > 0
        AND apflora.beobzuordnung."TPopId" = ${tpopId}
      ORDER BY
        "Datum" DESC
      LIMIT 100`
  } else if (apId) {
    // apart_id wurde übergeben > auf Art filtern
    if (nichtZuzuordnen) {
      // die nicht zuzuordnenden
      sql = `
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
          apflora.beobzuordnung."TPopId"
        FROM
          (beob.beob_bereitgestellt
          INNER JOIN
            beob.beob_evab
            ON beob.beob_bereitgestellt."NO_NOTE_PROJET" = beob.beob_evab."NO_NOTE_PROJET")
          LEFT JOIN
            apflora.beobzuordnung
            ON beob.beob_evab."NO_NOTE_PROJET" = apflora.beobzuordnung."NO_NOTE"
        WHERE
          beob.beob_evab."COORDONNEE_FED_E" > 0
          AND beob.beob_evab."COORDONNEE_FED_N" > 0
          AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
          AND beob.beob_evab."NO_ISFS" = ${apId}
        UNION SELECT
          to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') AS "NO_NOTE",
          beob.beob_infospezies."NO_ISFS",
          beob.beob_infospezies."FNS_XGIS" AS "X",
          beob.beob_infospezies."FNS_YGIS" AS "Y",
          to_char(beob.beob_infospezies."A_NOTE", 'FM9999999') AS "A_NOTE",
          beob.beob_bereitgestellt."Datum" AS "Datum",
          beob.beob_bereitgestellt."Autor",
          beob.beob_infospezies."PROJET",
          beob.beob_infospezies."DESC_LOCALITE",
          apflora.beobzuordnung."TPopId"
        FROM
          (beob.beob_infospezies
          INNER JOIN
            beob.beob_bereitgestellt
            ON beob.beob_infospezies."NO_NOTE" = beob.beob_bereitgestellt."NO_NOTE")
          LEFT JOIN
            apflora.beobzuordnung
            ON to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') = apflora.beobzuordnung."NO_NOTE"
        WHERE
          beob.beob_infospezies."FNS_XGIS" > 0
          AND beob.beob_infospezies."FNS_YGIS" > 0
          AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
          AND beob.beob_infospezies."NO_ISFS" = ${apId}
        ORDER BY
          "Datum" DESC
        LIMIT 100`
    } else {
      // die nicht beurteilten
      sql = `
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
          apflora.beobzuordnung."TPopId"
        FROM
          (beob.beob_bereitgestellt
          INNER JOIN
            beob.beob_evab
            ON beob.beob_bereitgestellt."NO_NOTE_PROJET" = beob.beob_evab."NO_NOTE_PROJET")
          LEFT JOIN
            apflora.beobzuordnung
            ON beob.beob_evab."NO_NOTE_PROJET" = apflora.beobzuordnung."NO_NOTE"
        WHERE
          beob.beob_evab."COORDONNEE_FED_E" > 0
          AND beob.beob_evab."COORDONNEE_FED_N" > 0
          AND apflora.beobzuordnung."TPopId" Is Null
          AND beob.beob_evab."NO_ISFS" = ${apId}
        UNION SELECT
          to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') AS "NO_NOTE",
          beob.beob_infospezies."NO_ISFS",
          beob.beob_infospezies."FNS_XGIS" AS "X",
          beob.beob_infospezies."FNS_YGIS" AS "Y",
          to_char(beob.beob_infospezies."A_NOTE", 'FM9999999') AS "A_NOTE",
          beob.beob_bereitgestellt."Datum" AS "Datum",
          beob.beob_bereitgestellt."Autor",
          beob.beob_infospezies."PROJET",
          beob.beob_infospezies."DESC_LOCALITE",
          apflora.beobzuordnung."TPopId"
        FROM
          (beob.beob_infospezies
          INNER JOIN
            beob.beob_bereitgestellt
            ON beob.beob_infospezies."NO_NOTE" = beob.beob_bereitgestellt."NO_NOTE")
          LEFT JOIN
            apflora.beobzuordnung
            ON to_char(beob.beob_infospezies."NO_NOTE", 'FM9999999') = apflora.beobzuordnung."NO_NOTE"
        WHERE
          beob.beob_infospezies."FNS_XGIS" > 0
          AND beob.beob_infospezies."FNS_YGIS" > 0
          AND apflora.beobzuordnung."TPopId" Is Null
          AND beob.beob_infospezies."NO_ISFS" = ${apId}
        ORDER BY
          "Datum" DESC
        LIMIT 100`
    }
  }
  // Daten abfragen
  request.pg.client.query(sql, (error, result) => {
    if (error) {
      callback(error, null)
    } else {
      callback(null, result.rows)
    }
  })
}
