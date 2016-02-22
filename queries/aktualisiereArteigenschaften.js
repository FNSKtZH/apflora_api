'use strict'

/*
 * need to test this again - not tested since converted to postgresql
 */

const request = require('request')
const createInsertSqlFromObjectArray = require('./createInsertSqlFromObjectArray')
const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (req, reply) => {
  // neue Daten holen
  request({
    method: 'GET',
    uri: 'http://arteigenschaften.ch/artendb/_design/artendb/_list/export_apflora/flora?include_docs=true',
    json: true
  }, (error, response, body) => {
    if (error) console.log(error)
    // console.log('get arteigenschaften response', response)
    if (response && response.statusCode === 200) {
      pg.connect(connectionString, (error, apfDb, done) => {
        if (error) {
          if (apfDb) done(apfDb)
          console.log('an error occured when trying to connect to db apflora')
        }
        // empty table
        apfDb.query(
          'TRUNCATE TABLE beob.adb_eigenschaften',
          (err) => {
            if (err) console.log(err)
            const eigenschaftenString = createInsertSqlFromObjectArray(body)
            const sqlBase = `
              INSERT INTO
                beob.adb_eigenschaften
                ("GUID", "TaxonomieId", "Familie", "Artname", "NameDeutsch", "Status", "Artwert", "KefArt", "KefKontrolljahr")
              VALUES `

            // add new values
            let sql = sqlBase + eigenschaftenString

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
      })
    }
  })
}
