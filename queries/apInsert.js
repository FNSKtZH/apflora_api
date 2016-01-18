'use strict'

const mysql = require('mysql')
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

  // neuen AP einfügen
  connection.query(
    'INSERT INTO apflora.ap (ApArtId, MutWann, MutWer) VALUES (' + apId + ', "' + date + '", "' + user + '")',
    function (err, data) {
      if (err) { callback(err, null) }
      // Artwert holen
      connection2.query(
        'SELECT Artwert FROM apflora_beob.adb_eigenschaften WHERE TaxonomieId=' + apId,
        function (err, data) {
          // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
          if (data && data[0]) {
            var artwert = data[0]
            if (artwert) {
              connection.query(
                'UPDATE apflora.ap SET ApArtwert="' + artwert + '" WHERE ApArtId = ' + apId,
                function (err, data) {
                  callback(err, apId)
                }
              )
            }
          } else {
            callback(err, null)
          }
        }
      )
    }
  )
}
