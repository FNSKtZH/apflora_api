/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict'

var mysql = require('mysql'),
  _ = require('underscore'),
  config = require('../configuration'),
  escapeStringForSql = require('./escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  var tabelle = escapeStringForSql(request.params.tabelle),         // der Name der Tabelle, in der die Daten gespeichert werden sollen
    tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld),   // das ist der Name der ID der Tabelle
    tabelleId = escapeStringForSql(request.params.tabelleId),       // der Wert der ID
    feld = escapeStringForSql(request.params.feld),            // der Name des Felds, dessen Daten gespeichert werden sollen
    wert = escapeStringForSql(request.params.wert),            // der Wert, der gespeichert werden soll
    user = escapeStringForSql(request.params.user),            // der Benutzername
    date = new Date().toISOString(),                           // wann gespeichert wird
    table = _.findWhere(config.tables, {tabelleInDb: tabelle}), // Infos über die Tabelle holen
    mutWannFeld = table.mutWannFeld,                                  // so heisst das Feld für MutWann
    mutWerFeld = table.mutWerFeld,                                   // so heisst das Feld für MutWer
    sql

  sql = 'UPDATE ' + tabelle + ' SET ' + feld + '="' + wert + '", ' + mutWannFeld + '="' + date + '", ' + mutWerFeld + '="' + user + '" WHERE ' + tabelleIdFeld + ' = "' + tabelleId + '"'
  // Ist ein Feld neu leer, muss NULL übergeben werden. wert ist dann 'undefined'
  if (!wert) {
    sql = 'UPDATE ' + tabelle + ' SET ' + feld + '= NULL, ' + mutWannFeld + '="' + date + '", ' + mutWerFeld + '="' + user + '" WHERE ' + tabelleIdFeld + ' = "' + tabelleId + '"'
  }

  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
