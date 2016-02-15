'use strict'

/*
 * need to test this again - not tested since converted to postgresql
 */

const request = require('request')
const createInsertSqlFromObjectArray = require('./createInsertSqlFromObjectArray')
const pg = require('pg')
const dbPass = require('../pgDbPass.json')
const user = dbPass.user
const pwd = dbPass.pass
const connectionString = `postgres://${user}:${pwd}@localhost/apflora`

// teilt einen Array in gleiche Teile
const split = (a, n) => {
  let len = a.length
  let out = []
  let i = 0
  let size
  while (i < len) {
    size = Math.ceil((len - i) / n--)
    out.push(a.slice(i, i += size))
  }
  return out
}

module.exports = (req, reply) => {
  // neue Daten holen
  request({
    method: 'GET',
    uri: 'http://arteigenschaften.ch/artendb/_design/artendb/_list/export_apflora/flora?include_docs=true',
    json: true
  }, (error, response, body) => {
    if (error) throw error
    if (response && response.statusCode === 200) {
      pg.connect(connectionString, (error, apfDb, done) => {
        if (error) {
          if (apfDb) done(apfDb)
          console.log('an error occured when trying to connect to db apflora')
        }
        // empty table
        apfDb.query(
          `TRUNCATE TABLE beob.adb_eigenschaften`,
          (err) => {
            if (err) throw err
            // Daten müssen in mehrere Teile aufgeteilt werden
            // sonst gibt es bei der Verarbeitung Abstürze
            // Idee: mit async.series automatisieren
            const artenArray = split(body, 5)
            const eigenschaftenString0 = createInsertSqlFromObjectArray(artenArray[0])
            const eigenschaftenString1 = createInsertSqlFromObjectArray(artenArray[1])
            const eigenschaftenString2 = createInsertSqlFromObjectArray(artenArray[2])
            const eigenschaftenString3 = createInsertSqlFromObjectArray(artenArray[3])
            const eigenschaftenString4 = createInsertSqlFromObjectArray(artenArray[4])
            const sqlBase = `
              INSERT INTO beob.adb_eigenschaften ("GUID", "TaxonomieId", "Familie", "Artname", "NameDeutsch", "Status", "Artwert", "KefArt", "KefKontrolljahr")
              VALUES `

            // add new values
            let sql = sqlBase + eigenschaftenString0

            apfDb.query(
              sql,
              (err) => {
                if (err) throw err
                sql = sqlBase + eigenschaftenString1
                apfDb.query(
                  sql,
                  (err) => {
                    if (err) throw err
                    sql = sqlBase + eigenschaftenString2
                    apfDb.query(
                      sql,
                      (err) => {
                        if (err) throw err
                        sql = sqlBase + eigenschaftenString3
                        apfDb.query(
                          sql,
                          (err) => {
                            if (err) throw err
                            sql = sqlBase + eigenschaftenString4
                            apfDb.query(
                              sql,
                              (err) => {
                                if (err) throw err
                                reply('Arteigenschaften hinzugefügt')
                                apfDb.end()
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
      })
    }
  })
}
