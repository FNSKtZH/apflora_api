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
  var tpopId = escapeStringForSql(request.params.tpopId)
  var tpopKontrId = escapeStringForSql(request.params.tpopKontrId)
  var user = escapeStringForSql(request.params.user) // der Benutzername
  var date = new Date().toISOString()                // wann gespeichert wird

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
        'CREATE TEMPORARY TABLE tmp SELECT * FROM tpopkontr WHERE TPopKontrId = ' + tpopKontrId,
        function (err) {
          // nur allfällige Fehler weiterleiten
          callback(err, null)
        }
      )
    },
    function (callback) {
      // TPopId anpassen
      connection.query(
        'UPDATE tmp SET TPopKontrId = NULL, TPopId = ' + tpopId + ', MutWann="' + date + '", MutWer="' + user + '"',
        function (err) {
          // nur allfällige Fehler weiterleiten
          callback(err, null)
        }
      )
    },
    function (callback) {
      connection.query(
        'INSERT INTO tpopkontr SELECT * FROM tmp',
        function (err, data) {
          callback(err, data.insertId)
        }
      )
    }
  ], function (err, results) {
    var sql = ''
    var tpopkontridNeu = results[3]

    if (err) { return callback(err, null) }
    // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
    sql += 'INSERT INTO tpopkontrzaehl (Anzahl, Zaehleinheit, Methode, MutWann, MutWer, TPopKontrId)'
    sql += ' SELECT tpopkontrzaehl.Anzahl, tpopkontrzaehl.Zaehleinheit, tpopkontrzaehl.Methode, "' + date + '", "' + user + '", ' + tpopkontridNeu
    sql += ' FROM tpopkontrzaehl'
    sql += ' WHERE tpopkontrzaehl.TPopKontrId=' + tpopKontrId
    console.log('sql: ', sql)
    connection.query(
      sql,
      function (err, data) {
        // neue tpopkontrId zurück liefern
        callback(null, tpopkontridNeu)
      }
    )
  })
}
