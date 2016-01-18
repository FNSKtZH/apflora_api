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
  var apId = escapeStringForSql(request.params.apId)
  var sql

  sql = [
    'SELECT apflora_beob.beob_evab.NO_NOTE_PROJET AS "NO_NOTE", apflora_beob.beob_evab.NO_ISFS, apflora_beob.beob_evab.COORDONNEE_FED_E AS "X", apflora_beob.beob_evab.COORDONNEE_FED_N AS "Y", apflora_beob.beob_evab.A_NOTE, apflora_beob.beob_bereitgestellt.Datum AS "Datum", apflora_beob.beob_bereitgestellt.Autor, apflora_beob.beob_evab.Projekt_ZH AS "PROJET", apflora_beob.beob_evab.DESC_LOCALITE_ AS "DESC_LOCALITE", apflora.beobzuordnung.TPopId, CONCAT(apflora.pop.PopNr, "/", apflora.tpop.TPopNr) AS popTpopNr',
    'FROM (((apflora_beob.beob_bereitgestellt INNER JOIN apflora_beob.beob_evab ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = apflora_beob.beob_evab.NO_NOTE_PROJET) LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_evab.NO_NOTE_PROJET = apflora.beobzuordnung.NO_NOTE) LEFT JOIN apflora.tpop ON apflora.beobzuordnung.TPopId = apflora.tpop.TPopId) LEFT JOIN apflora.pop ON apflora.tpop.PopId = apflora.pop.PopId',
    'WHERE apflora_beob.beob_evab.COORDONNEE_FED_E>"0" AND apflora_beob.beob_evab.COORDONNEE_FED_N>"0" AND apflora.beobzuordnung.beobNichtZuordnen Is Null AND apflora_beob.beob_evab.NO_ISFS=' + apId,
    'UNION SELECT apflora_beob.beob_infospezies.NO_NOTE, apflora_beob.beob_infospezies.NO_ISFS, apflora_beob.beob_infospezies.FNS_XGIS AS X, apflora_beob.beob_infospezies.FNS_YGIS AS Y, apflora_beob.beob_infospezies.A_NOTE, apflora_beob.beob_bereitgestellt.Datum AS Datum, apflora_beob.beob_bereitgestellt.Autor, apflora_beob.beob_infospezies.PROJET, apflora_beob.beob_infospezies.DESC_LOCALITE, apflora.beobzuordnung.TPopId, CONCAT(apflora.tpop.TPopNr, "/", apflora.pop.PopNr) AS popTpopNr',
    'FROM (((apflora_beob.beob_infospezies INNER JOIN apflora_beob.beob_bereitgestellt ON apflora_beob.beob_infospezies.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE) LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_infospezies.NO_NOTE = apflora.beobzuordnung.NO_NOTE) LEFT JOIN apflora.tpop ON apflora.beobzuordnung.TPopId = apflora.tpop.TPopId) LEFT JOIN apflora.pop ON apflora.tpop.PopId = apflora.pop.PopId',
    'WHERE apflora_beob.beob_infospezies.FNS_XGIS>0 AND apflora_beob.beob_infospezies.FNS_YGIS>0 AND apflora.beobzuordnung.beobNichtZuordnen Is Null AND apflora_beob.beob_infospezies.NO_ISFS=' + apId,
    'ORDER BY Datum DESC'
  ]

  // Daten abfragen
  connection.query(
    sql.join(' '),
    (err, data) => callback(err, data)
  )
}
