'use strict'

var mysql = require('mysql')
var config = require('../configuration')
var request = require('request')
var createInsertSqlFromObjectArray = require('./createInsertSqlFromObjectArray')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

// teilt einen Array in gleiche Teile
function split (a, n) {
  var len = a.length
  var out = []
  var i = 0
  var size
  while (i < len) {
    size = Math.ceil((len - i) / n--)
    out.push(a.slice(i, i += size))
  }
  return out
}

module.exports = function (req, reply) {
  // neue Daten holen
  request({
    method: 'GET',
    uri: 'http://arteigenschaften.ch/artendb/_design/artendb/_list/export_apflora/flora?include_docs=true',
    json: true
  }, function (error, response, body) {
    if (error) { throw error }
    if (!error && response.statusCode === 200) {
      // empty table
      connection.query(
        'TRUNCATE TABLE apflora_beob.adb_eigenschaften',
        function (err) {
          if (err) { throw err }
          // Daten müssen in mehrere Teile aufgeteilt werden
          // sonst gibt es bei der Verarbeitung Abstürze
          // Idee: mit async.series automatisieren
          var artenArray = split(body, 5)
          var eigenschaftenString0 = createInsertSqlFromObjectArray(artenArray[0])
          var eigenschaftenString1 = createInsertSqlFromObjectArray(artenArray[1])
          var eigenschaftenString2 = createInsertSqlFromObjectArray(artenArray[2])
          var eigenschaftenString3 = createInsertSqlFromObjectArray(artenArray[3])
          var eigenschaftenString4 = createInsertSqlFromObjectArray(artenArray[4])
          var sqlBase = 'INSERT INTO apflora_beob.adb_eigenschaften (GUID, TaxonomieId, Familie, Artname, NameDeutsch, Status, Artwert, KefArt, KefKontrolljahr) VALUES '
          var sql

          // add new values
          sql = sqlBase + eigenschaftenString0

          connection.query(
            sql,
            function (err) {
              // console.log('eigenschaftenString0 verarbeitet')
              if (err) {
                throw err
              }
              sql = sqlBase + eigenschaftenString1
              connection.query(
                sql,
                function (err) {
                  // console.log('eigenschaftenString1 verarbeitet')
                  if (err) {
                    throw err
                  }
                  sql = sqlBase + eigenschaftenString2
                  connection.query(
                    sql,
                    function (err) {
                      // console.log('eigenschaftenString2 verarbeitet')
                      if (err) {
                        throw err
                      }
                      sql = sqlBase + eigenschaftenString3
                      connection.query(
                        sql,
                        function (err) {
                          // console.log('eigenschaftenString2 verarbeitet')
                          if (err) {
                            throw err
                          }
                          sql = sqlBase + eigenschaftenString4
                          connection.query(
                            sql,
                            function (err) {
                              // console.log('eigenschaftenString2 verarbeitet')
                              if (err) {
                                throw err
                              }
                              reply('Arteigenschaften hinzugefügt')
                              connection.end()
                            }
                          )
                        }
                      )
                    }
                  )
                }
              )
            }
          )
        }
      )
    }
  })
}
