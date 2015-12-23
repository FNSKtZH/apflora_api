'use strict'

var mysql = require('mysql')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = function (request, callback) {
  var tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  var feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  var wert = escapeStringForSql(request.params.wert) // Wert der ID

  connection.query(
    'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '=' + wert,
    function (err, data) {
      callback(err, data)
    }
  )
}
