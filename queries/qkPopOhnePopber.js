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
    sqlPopMitTpopMitVerlangtemTpopberImBerjahr,
    sqlPopMitPopberImBerjahr

  // 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
  sqlTpopMitAnsVorBerjahr = 'SELECT DISTINCT apflora.tpopmassn.TPopId FROM apflora.tpopmassn WHERE apflora.tpopmassn.TPopMassnTyp in (1, 2, 3) AND apflora.tpopmassn.TPopMassnJahr < ' + berichtjahr
  // 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  sqlTpopMitKontrolleImBerjahr = 'SELECT DISTINCT apflora.tpopkontr.TPopId FROM apflora.tpopkontr WHERE apflora.tpopkontr.TPopKontrTyp NOT IN ("Zwischenziel", "Ziel") AND apflora.tpopkontr.TPopKontrJahr = ' + berichtjahr
  // 3. "Pop mit TPop mit verlangten TPopBer im Berichtjahr" ermitteln:
  sqlPopMitTpopMitVerlangtemTpopberImBerjahr = 'SELECT DISTINCT apflora.tpop.PopId FROM apflora.tpop WHERE apflora.tpop.TPopId IN (' + sqlTpopMitAnsVorBerjahr + ') AND apflora.tpop.TPopId IN (' + sqlTpopMitKontrolleImBerjahr + ')'
  // 4. "Pop mit PopBer im Berichtjahr" ermitteln:
  sqlPopMitPopberImBerjahr = 'SELECT DISTINCT apflora.popber.PopId FROM apflora.popber WHERE apflora.popber.PopBerJahr = ' + berichtjahr
  // 5. "Pop ohne verlangten Pop-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  sql = 'SELECT DISTINCT apflora.pop.ApArtId, \'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Populations-Bericht (im Berichtjahr):\' AS hw, CONCAT(\'<a href="http://apflora.ch/index.html?ap=\', apflora.pop.ApArtId, \'&pop=\', apflora.pop.PopId, \'" target="_blank">\', IFNULL(CONCAT(\'Pop: \', apflora.pop.PopNr), CONCAT(\'Pop: id=\', apflora.pop.PopId)), \'</a>\') AS link FROM apflora.pop WHERE apflora.pop.PopId IN (' + sqlPopMitTpopMitVerlangtemTpopberImBerjahr + ') AND apflora.pop.PopId NOT IN (' + sqlPopMitPopberImBerjahr + ') AND apflora.pop.ApArtId = ' + apId

  // Daten abfragen
  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
