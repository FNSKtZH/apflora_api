'use strict'

var mysql = require('mysql'),
  config = require('../configuration'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora_views'
  })

module.exports = function (request, callback) {
  var sql,
    apId = request.params.apId,
    berichtjahr = request.params.berichtjahr || null,
    sqlTpopMitAnsVorBerjahr,
    sqlTpopMitKontrolleImBerjahr,
    sqlTpopMitTpopberImBerjahr

  // 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
  sqlTpopMitAnsVorBerjahr = 'SELECT DISTINCT apflora.tpopmassn.TPopId FROM apflora.tpopmassn WHERE apflora.tpopmassn.TPopMassnTyp in (1, 2, 3) AND apflora.tpopmassn.TPopMassnJahr < ' + berichtjahr
  // 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  sqlTpopMitKontrolleImBerjahr = 'SELECT DISTINCT apflora.tpopkontr.TPopId FROM apflora.tpopkontr WHERE apflora.tpopkontr.TPopKontrTyp NOT IN ("Zwischenziel", "Ziel") AND apflora.tpopkontr.TPopKontrJahr = ' + berichtjahr
  // 3. "TPop mit TPopBer im Berichtjahr" ermitteln:
  sqlTpopMitTpopberImBerjahr = 'SELECT DISTINCT apflora.tpopber.TPopId FROM apflora.tpopber WHERE apflora.tpopber.TPopBerJahr = ' + berichtjahr
  // 4. "TPop ohne verlangten TPop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  sql = 'SELECT DISTINCT apflora.pop.ApArtId, \'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Teilpopulations-Bericht (im Berichtjahr):\' AS hw, CONCAT(\'<a href="http://apflora.ch/index.html?ap=\', apflora.pop.ApArtId, \'&pop=\', apflora.pop.PopId, \'&tpop=\', apflora.tpop.TPopId, \'" target="_blank">\', IFNULL(CONCAT(\'Pop: \', apflora.pop.PopNr), CONCAT(\'Pop: id=\', apflora.pop.PopId)), IFNULL(CONCAT(\' > TPop: \', apflora.tpop.TPopNr), CONCAT(\' > TPop: \', apflora.tpop.TPopId)), \'</a>\') AS link FROM apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId WHERE apflora.tpop.TPopId IN (' + sqlTpopMitAnsVorBerjahr + ') AND apflora.tpop.TPopId IN (' + sqlTpopMitKontrolleImBerjahr + ') AND apflora.tpop.TPopId NOT IN (' + sqlTpopMitTpopberImBerjahr + ') AND apflora.pop.ApArtId = ' + apId

  // Daten abfragen
  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
