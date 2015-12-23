'use strict'

var mysql = require('mysql')
var async = require('async')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  var tpopId = escapeStringForSql(request.params.tpopId)
  var popId = escapeStringForSql(request.params.popId)
  var user = escapeStringForSql(request.params.user) // der Benutzername
  var date = new Date().toISOString() // wann gespeichert wird

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
