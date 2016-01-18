'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const tpopId = escapeStringForSql(request.params.tpopId)
  const beobId = escapeStringForSql(request.params.beobId)
  const nichtZuzuordnen = escapeStringForSql(request.params.nichtZuzuordnen)
  let sql

  if (beobId) {
    // beobid wurde übergeben > auf eine Beobachtung filtern
    sql = `
    SELECT
      beob_infospezies.NO_NOTE,
      beob_infospezies.NO_ISFS,
      beob_infospezies.FNS_XGIS AS X,
      beob_infospezies.FNS_YGIS AS Y,
      beob_infospezies.A_NOTE,
      beob_bereitgestellt.Datum AS Datum,
      beob_bereitgestellt.Autor,
      beob_infospezies.PROJET,
      beob_infospezies.DESC_LOCALITE
    FROM beob_infospezies
      INNER JOIN beob_bereitgestellt ON beob_infospezies.NO_NOTE = beob_bereitgestellt.NO_NOTE
    WHERE beob_infospezies.FNS_XGIS > 0
      AND beob_infospezies.FNS_YGIS > 0
      AND beob_infospezies.NO_NOTE = "${beobId}"
    UNION SELECT
      beob_evab.NO_NOTE_PROJET AS NO_NOTE,
      beob_evab.NO_ISFS,
      beob_evab.COORDONNEE_FED_E AS X,
      beob_evab.COORDONNEE_FED_N AS Y,
      beob_evab.A_NOTE,
      beob_bereitgestellt.Datum AS Datum,
      beob_bereitgestellt.Autor,
      beob_evab.Projekt_ZH AS PROJET,
      beob_evab.DESC_LOCALITE_ AS DESC_LOCALITE
    FROM beob_bereitgestellt
      INNER JOIN beob_evab ON beob_bereitgestellt.NO_NOTE_PROJET = beob_evab.NO_NOTE_PROJET
    WHERE beob_evab.COORDONNEE_FED_E > 0
      AND beob_evab.COORDONNEE_FED_N > 0
      AND beob_evab.NO_NOTE_PROJET = "${beobId}"
    ORDER BY Datum DESC
    LIMIT 100`
  } else if (tpopId) {
    // tpopId wurde übergeben > auf tpop filtern
    sql = `
    SELECT
      apflora_beob.beob_infospezies.NO_NOTE,
      apflora_beob.beob_infospezies.NO_ISFS,
      apflora_beob.beob_infospezies.FNS_XGIS AS X,
      apflora_beob.beob_infospezies.FNS_YGIS AS Y,
      apflora_beob.beob_infospezies.A_NOTE,
      apflora_beob.beob_bereitgestellt.Datum AS Datum,
      apflora_beob.beob_bereitgestellt.Autor,
      apflora_beob.beob_infospezies.PROJET,
      apflora_beob.beob_infospezies.DESC_LOCALITE,
      apflora.beobzuordnung.TPopId,
      apflora.tpop.TPopXKoord,
      apflora.tpop.TPopYKoord
    FROM (apflora_beob.beob_infospezies
      INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE)
      INNER JOIN (apflora.tpop
        INNER JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId) ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE
    WHERE apflora_beob.beob_infospezies.FNS_XGIS > 0
      AND apflora_beob.beob_infospezies.FNS_YGIS > 0
      AND apflora.beobzuordnung.TPopId = ${tpopId}
    UNION SELECT
      apflora_beob.beob_evab.NO_NOTE_PROJET AS NO_NOTE,
      apflora_beob.beob_evab.NO_ISFS,
      apflora_beob.beob_evab.COORDONNEE_FED_E AS X,
      apflora_beob.beob_evab.COORDONNEE_FED_N AS Y,
      apflora_beob.beob_evab.A_NOTE,
      apflora_beob.beob_bereitgestellt.Datum AS Datum,
      apflora_beob.beob_bereitgestellt.Autor,
      apflora_beob.beob_evab.Projekt_ZH AS PROJET,
      apflora_beob.beob_evab.DESC_LOCALITE_ AS DESC_LOCALITE,
      apflora.beobzuordnung.TPopId,
      apflora.tpop.TPopXKoord,
      apflora.tpop.TPopYKoord
    FROM (apflora_beob.beob_bereitgestellt
      INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET)
      INNER JOIN (apflora.tpop
        INNER JOIN apflora.beobzuordnung ON apflora.tpop.TPopId = apflora.beobzuordnung.TPopId) ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE
    WHERE apflora_beob.beob_evab.COORDONNEE_FED_E > 0
      AND apflora_beob.beob_evab.COORDONNEE_FED_N > 0
      AND apflora.beobzuordnung.TPopId = ${tpopId}
    ORDER BY Datum DESC
    LIMIT 100`
  } else if (apId) {
    // apart_id wurde übergeben > auf Art filtern
    if (nichtZuzuordnen) {
      // die nicht zuzuordnenden
      sql = `
      SELECT
        apflora_beob.beob_evab.NO_NOTE_PROJET AS NO_NOTE,
        apflora_beob.beob_evab.NO_ISFS,
        apflora_beob.beob_evab.COORDONNEE_FED_E AS X,
        apflora_beob.beob_evab.COORDONNEE_FED_N AS Y,
        apflora_beob.beob_evab.A_NOTE,
        apflora_beob.beob_bereitgestellt.Datum AS Datum,
        apflora_beob.beob_bereitgestellt.Autor,
        apflora_beob.beob_evab.Projekt_ZH AS PROJET,
        apflora_beob.beob_evab.DESC_LOCALITE_ AS DESC_LOCALITE,
        apflora.beobzuordnung.TPopId
      FROM (apflora_beob.beob_bereitgestellt
        INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET)
        LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE
      WHERE apflora_beob.beob_evab.COORDONNEE_FED_E > 0
        AND apflora_beob.beob_evab.COORDONNEE_FED_N > 0
        AND apflora.beobzuordnung.beobNichtZuordnen = 1
        AND apflora_beob.beob_evab.NO_ISFS = ${apId}
      UNION SELECT
        apflora_beob.beob_infospezies.NO_NOTE,
        apflora_beob.beob_infospezies.NO_ISFS,
        apflora_beob.beob_infospezies.FNS_XGIS AS X,
        apflora_beob.beob_infospezies.FNS_YGIS AS Y,
        apflora_beob.beob_infospezies.A_NOTE,
        apflora_beob.beob_bereitgestellt.Datum AS Datum,
        apflora_beob.beob_bereitgestellt.Autor,
        apflora_beob.beob_infospezies.PROJET,
        apflora_beob.beob_infospezies.DESC_LOCALITE,
        apflora.beobzuordnung.TPopId
      FROM (apflora_beob.beob_infospezies
        INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE)
        LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE
      WHERE apflora_beob.beob_infospezies.FNS_XGIS > 0
        AND apflora_beob.beob_infospezies.FNS_YGIS > 0
        AND apflora.beobzuordnung.beobNichtZuordnen = 1
        AND apflora_beob.beob_infospezies.NO_ISFS = ${apId}
      ORDER BY Datum DESC
      LIMIT 100`
    } else {
      // die nicht beurteilten
      sql = `
      SELECT
        apflora_beob.beob_evab.NO_NOTE_PROJET AS NO_NOTE,
        apflora_beob.beob_evab.NO_ISFS,
        apflora_beob.beob_evab.COORDONNEE_FED_E AS X,
        apflora_beob.beob_evab.COORDONNEE_FED_N AS Y,
        apflora_beob.beob_evab.A_NOTE,
        apflora_beob.beob_bereitgestellt.Datum AS Datum,
        apflora_beob.beob_bereitgestellt.Autor,
        apflora_beob.beob_evab.Projekt_ZH AS PROJET,
        apflora_beob.beob_evab.DESC_LOCALITE_ AS DESC_LOCALITE,
        apflora.beobzuordnung.TPopId
      FROM (apflora_beob.beob_bereitgestellt
        INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET)
        LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE
      WHERE apflora_beob.beob_evab.COORDONNEE_FED_E > 0
        AND apflora_beob.beob_evab.COORDONNEE_FED_N > 0
        AND apflora.beobzuordnung.TPopId Is Null
        AND apflora_beob.beob_evab.NO_ISFS = ${apId}
      UNION SELECT
        apflora_beob.beob_infospezies.NO_NOTE,
        apflora_beob.beob_infospezies.NO_ISFS,
        apflora_beob.beob_infospezies.FNS_XGIS AS X,
        apflora_beob.beob_infospezies.FNS_YGIS AS Y,
        apflora_beob.beob_infospezies.A_NOTE,
        apflora_beob.beob_bereitgestellt.Datum AS Datum,
        apflora_beob.beob_bereitgestellt.Autor,
        apflora_beob.beob_infospezies.PROJET,
        apflora_beob.beob_infospezies.DESC_LOCALITE,
        apflora.beobzuordnung.TPopId
      FROM (apflora_beob.beob_infospezies
        INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE)
        LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE
      WHERE apflora_beob.beob_infospezies.FNS_XGIS > 0
        AND apflora_beob.beob_infospezies.FNS_YGIS > 0
        AND apflora.beobzuordnung.TPopId Is Null
        AND apflora_beob.beob_infospezies.NO_ISFS = ${apId}
      ORDER BY Datum DESC
      LIMIT 100`
    }
  }
  // Daten abfragen
  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
