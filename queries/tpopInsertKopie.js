'use strict'

var mysql = require('mysql'),
  async = require('async'),
  config = require('../configuration'),
  escapeStringForSql = require('./escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  var tpopId = escapeStringForSql(request.params.tpopId),
    popId = escapeStringForSql(request.params.popId),
    user = escapeStringForSql(request.params.user),   // der Benutzername
    date = new Date().toISOString()                   // wann gespeichert wird

  async.series([
    function (callback) {
      // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
      connection.query(
        'DROP TABLE IF EXISTS tmp',
        function (err) {
          // nur allfällige Fehler weiterleiten
          callback(err, null)
        }
      )
    },
    function (callback) {
      // Temporäre Tabelle erstellen mit dem zu kopierenden Datensatz
      connection.query(
        'CREATE TEMPORARY TABLE tmp SELECT * FROM tpop WHERE TPopId = ' + tpopId,
        function (err) {
          // nur allfällige Fehler weiterleiten
          callback(err, null)
        }
      )
    },
    function (callback) {
      // TPopId anpassen
      connection.query(
        'UPDATE tmp SET TPopId = NULL, PopId = ' + popId + ', MutWann="' + date + '", MutWer="' + user + '"',
        function (err) {
          // nur allfällige Fehler weiterleiten
          callback(err, null)
        }
      )
    },
    function (callback) {
      connection.query(
        'INSERT INTO tpop SELECT * FROM tmp',
        function (err, data) {
          callback(err, data.insertId)
        }
      )
    }
  ], function (err, results) {
    // neue id zurück liefern
    callback(err, results[3])
  })
}
