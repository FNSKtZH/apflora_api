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
  }),
  connection2 = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora_beob'
  })

module.exports = function (request, callback) {
  var apId = escapeStringForSql(request.params.apId), // ApArtId
    user = escapeStringForSql(request.params.user),   // der Benutzername
    date = new Date().toISOString()                   // wann gespeichert wird

  async.parallel({
    insertIntoTblAktionsplan: function (callback) {
      connection.query(
        'INSERT INTO apflora.ap (ApArtId, MutWann, MutWer) VALUES (' + apId + ', "' + date + '", "' + user + '")',
        function (err, data) {
          console.log('apInsert, insertIntoTblAktionsplan: data after insert = ', data)
          callback(err, null)
        }
      )
    },
    getArtwert: function (callback) {
      connection2.query(
        'SELECT Artwert FROM apflora_beob.adb_eigenschaften WHERE TaxonomieId=' + apId,
        function (err, data) {
          console.log('apInsert, getArtwert: data after insert = ', data)
          // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
          if (data && data[0]) {
            var artwert = data[0]
            callback(err, artwert)
          } else {
            callback(err, null)
          }
        }
      )
    }
  }, function (err, results) {
    var artwert = results.getArtwert || null
    if (artwert) {
      connection.query(
        'UPDATE apflora.ap SET ApArtwert="' + artwert + '" WHERE ApArtId = ' + apId,
        function (err, data) {
          console.log('apInsert, update Aktionsplan with artwert: data after update = ', data)
        // nichts tun
        }
      )
    }
  })
}
