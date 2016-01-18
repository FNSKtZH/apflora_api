'use strict'

const mysql = require('mysql')
const async = require('async')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})
var connection2 = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  var user = escapeStringForSql(request.params.user)
  var date = new Date().toISOString()

  async.parallel({
    insertIntoTblAktionsplan: (callback) => {
      connection.query(
        'INSERT INTO apflora.ap (ApArtId, MutWann, MutWer) VALUES (' + apId + ', "' + date + '", "' + user + '")',
        function (err, data) {
          console.log('apInsert, insertIntoTblAktionsplan: data after insert = ', data)
          callback(err, null)
        }
      )
    },
    getArtwert: (callback) => {
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
