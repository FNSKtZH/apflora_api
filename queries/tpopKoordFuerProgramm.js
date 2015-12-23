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
  var apId = escapeStringForSql(request.params.apId)
  // Daten abfragen
  connection.query(
    'SELECT DISTINCT pop.ApArtId, pop.PopId, pop.PopNr, tpop.TPopId, tpop.TPopNr, tpop.TPopXKoord, tpop.TPopYKoord, tpop.TPopApBerichtRelevant FROM pop INNER JOIN tpop ON pop.PopId = tpop.PopId WHERE tpop.TPopXKoord Is Not Null AND tpop.TPopYKoord Is Not Null AND pop.ApArtId = ' + apId,
    function (err, data) {
      callback(err, data)
    }
  )
}
