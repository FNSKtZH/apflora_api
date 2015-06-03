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
  var tabelle = escapeStringForSql(request.params.tabelle), // der Name der Tabelle, aus der die Daten geholt werden sollen
    feld = escapeStringForSql(request.params.feld),         // das ist der Name des Feldes, das verglichen wird
    wert = escapeStringForSql(request.params.wert)          // der Wert im Feld, das verglichen wird

  connection.query(
    'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '="' + wert + '"',
    function (err, data) {
      callback(err, data)
    }
  )
}
