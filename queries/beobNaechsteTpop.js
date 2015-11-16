'use strict'

var mysql = require('mysql'),
  config = require('../configuration'),
  escapeStringForSql = require('./escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  var apId = escapeStringForSql(request.params.apId),
    X = escapeStringForSql(request.params.X),
    Y = escapeStringForSql(request.params.Y)

  connection.query(
    'SELECT PopNr, TPopNr, TPopId, TPopFlurname, SQRT((' + X + '-TPopXKoord)*(' + X + '-TPopXKoord)+(' + Y + '-TPopYKoord)*(' + Y + '-TPopYKoord)) AS DistZuTPop FROM pop INNER JOIN tpop ON pop.PopId = tpop.PopId WHERE ApArtId = ' + apId + ' AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL ORDER BY DistzuTPop LIMIT 1',
    function (err, data) {
      callback(err, data)
    }
  )
}
