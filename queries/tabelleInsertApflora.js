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
    feld = escapeStringForSql(request.params.feld),            // der Name des Felds, dessen Daten gespeichert werden sollen
    wert = escapeStringForSql(request.params.wert),            // der Wert, der gespeichert werden soll
    user = escapeStringForSql(request.params.user),            // der Benutzername
    date = new Date().toISOString(),                           // wann gespeichert wird
    configTable = _.findWhere(config.tables, {tabelleInDb: tabelle}), // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
    nameMutwannFeld = configTable.mutWannFeld || 'MutWann',               // so heisst das MutWann-Feld in dieser Tabelle
    nameMutWerFeld = configTable.mutWerFeld || 'MutWer',                // so heisst das MutWer-Feld in dieser Tabelle
    sql

  sql = 'INSERT INTO ' + tabelle + ' (' + feld + ', ' + nameMutwannFeld + ', ' + nameMutWerFeld + ') VALUES ("' + wert + '", "' + date + '", "' + user + '")'

  connection.query(
    sql,
    function (err, data) {
      callback(err, data.insertId)
    }
  )
}
