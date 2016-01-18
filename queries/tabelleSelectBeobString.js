'use strict'

const mysql = require('mysql')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = function (request, callback) {
  var tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten geholt werden sollen
  var feld = escapeStringForSql(request.params.feld) // das ist der Name des Feldes, das verglichen wird
  var wert = escapeStringForSql(request.params.wert) // der Wert im Feld, das verglichen wird

  connection.query(
    'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '="' + wert + '"',
    function (err, data) {
      callback(err, data)
    }
  )
}
