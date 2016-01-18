'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_views'
})

module.exports = (request, callback) => {
  var sql
  var apId = request.params.apId
  var berichtjahr = request.params.berichtjahr || null
  var sqlTpopMitAnsVorBerjahr
  var sqlTpopMitKontrolleImBerjahr
  var sqlTpopMitTpopmassnberImBerjahr

  // 1. "TPop mit Ansiedlungen/Ansaaten vor dem Berichtjahr" ermitteln:
  sqlTpopMitAnsVorBerjahr = 'SELECT DISTINCT apflora.tpopmassn.TPopId FROM apflora.tpopmassn WHERE apflora.tpopmassn.TPopMassnTyp in (1, 2, 3) AND apflora.tpopmassn.TPopMassnJahr < ' + berichtjahr
  // 2. "TPop mit Kontrolle im Berichtjahr" ermitteln:
  sqlTpopMitKontrolleImBerjahr = 'SELECT DISTINCT apflora.tpopkontr.TPopId FROM apflora.tpopkontr WHERE apflora.tpopkontr.TPopKontrTyp NOT IN ("Zwischenziel", "Ziel") AND apflora.tpopkontr.TPopKontrJahr = ' + berichtjahr
  // 3. "TPop mit TPopMassnBer im Berichtjahr" ermitteln:
  sqlTpopMitTpopmassnberImBerjahr = 'SELECT DISTINCT apflora.tpopmassnber.TPopId FROM apflora.tpopmassnber WHERE apflora.tpopmassnber.TPopMassnBerJahr = ' + berichtjahr
  // 4. "TPop ohne verlangten Massnahmen-Bericht im Berichtjahr" ermitteln und in Qualitätskontrollen auflisten:
  sql = 'SELECT DISTINCT apflora.pop.ApArtId, \'Teilpopulation mit Ansiedlung (vor dem Berichtjahr) und Kontrolle (im Berichtjahr) aber ohne Massnahmen-Bericht (im Berichtjahr):\' AS hw, CONCAT(\'<a href="http://apflora.ch/index.html?ap=\', apflora.pop.ApArtId, \'&pop=\', apflora.pop.PopId, \'&tpop=\', apflora.tpop.TPopId, \'" target="_blank">\', IFNULL(CONCAT(\'Pop: \', apflora.pop.PopNr), CONCAT(\'Pop: id=\', apflora.pop.PopId)), IFNULL(CONCAT(\' > TPop: \', apflora.tpop.TPopNr), CONCAT(\' > TPop: \', apflora.tpop.TPopId)), \'</a>\') AS link FROM apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId WHERE apflora.tpop.TPopId IN (' + sqlTpopMitAnsVorBerjahr + ') AND apflora.tpop.TPopId IN (' + sqlTpopMitKontrolleImBerjahr + ') AND apflora.tpop.TPopId NOT IN (' + sqlTpopMitTpopmassnberImBerjahr + ') AND apflora.pop.ApArtId = ' + apId

  // Daten abfragen
  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
