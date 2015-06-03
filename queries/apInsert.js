'use strict'

var mysql = require('mysql'),
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
    user = escapeStringForSql(request.params.user), // der Benutzername
    date = new Date().toISOString()                // wann gespeichert wird

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
