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
    sqlPopMitTpopMitVerlangtemTpopmassnberImBerjahr,
    sqlPopMitPopmassnberImBerjahr

  // 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
  sqlTpopMitAnsVorBerjahr = 'SELECT DISTINCT apflora.tpopmassn.TPopId FROM apflora.tpopmassn WHERE apflora.tpopmassn.TPopMassnTyp in (1, 2, 3) AND apflora.tpopmassn.TPopMassnJahr < ' + berichtjahr
  // 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  sqlTpopMitKontrolleImBerjahr = 'SELECT DISTINCT apflora.tpopkontr.TPopId FROM apflora.tpopkontr WHERE apflora.tpopkontr.TPopKontrTyp NOT IN ("Zwischenziel", "Ziel") AND apflora.tpopkontr.TPopKontrJahr = ' + berichtjahr
  // 3. "Pop mit TPop mit verlangten TPopMassnBer im Berichtjahr" ermitteln:
  sqlPopMitTpopMitVerlangtemTpopmassnberImBerjahr = 'SELECT DISTINCT apflora.tpop.PopId FROM apflora.tpop WHERE apflora.tpop.TPopId IN (' + sqlTpopMitAnsVorBerjahr + ') AND apflora.tpop.TPopId IN (' + sqlTpopMitKontrolleImBerjahr + ')'
  // 4. "Pop mit PopMassnBer im Berichtjahr" ermitteln:
  sqlPopMitPopmassnberImBerjahr = 'SELECT DISTINCT apflora.popmassnber.PopId FROM apflora.popmassnber WHERE apflora.popmassnber.PopMassnBerJahr = ' + berichtjahr
  // 5. "Pop ohne verlangten Pop-Massn-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  sql = 'SELECT DISTINCT apflora.pop.ApArtId, \'Population mit angesiedelten Teilpopulationen (vor dem Berichtjahr), die (im Berichtjahr) kontrolliert wurden, aber ohne Massnahmen-Bericht (im Berichtjahr):\' AS hw, CONCAT(\'<a href="http://apflora.ch/index.html?ap=\', apflora.pop.ApArtId, \'&pop=\', apflora.pop.PopId, \'" target="_blank">\', IFNULL(CONCAT(\'Pop: \', apflora.pop.PopNr), CONCAT(\'Pop: id=\', apflora.pop.PopId)), \'</a>\') AS link FROM apflora.pop WHERE apflora.pop.PopId IN (' + sqlPopMitTpopMitVerlangtemTpopmassnberImBerjahr + ') AND apflora.pop.PopId NOT IN (' + sqlPopMitPopmassnberImBerjahr + ') AND apflora.pop.ApArtId = ' + apId

  // Daten abfragen
  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
