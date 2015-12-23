'use strict'

var mysql = require('mysql')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  var beobId = escapeStringForSql(request.params.beobId)

  connection.query(
    'SELECT NO_NOTE_PROJET, NO_ISFS, apflora.tpop.TPopId, COORDONNEE_FED_E, COORDONNEE_FED_N, TPopXKoord, TPopYKoord, PopNr, TPopNr, TPopFlurname, SQRT((COORDONNEE_FED_E-TPopXKoord)*(COORDONNEE_FED_E-TPopXKoord)+(COORDONNEE_FED_N-TPopYKoord)*(COORDONNEE_FED_N-TPopYKoord)) AS DistZuTPop FROM apflora_beob.beob_evab INNER JOIN (apflora.pop INNER JOIN apflora.tpop ON apflora.pop.PopId = apflora.tpop.PopId) ON NO_ISFS = ApArtId WHERE NO_NOTE_PROJET ="' + beobId + '" AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL AND COORDONNEE_FED_E IS NOT NULL AND COORDONNEE_FED_N IS NOT NULL ORDER BY DistzuTPop, TPopFlurname',
    function (err, data) {
      callback(err, data)
    }
  )
}
