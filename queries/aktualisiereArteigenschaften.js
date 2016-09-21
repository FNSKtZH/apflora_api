'use strict'

const app = require('ampersand-app')

/*
 * need to test this again - not tested since converted to postgresql
 */

const request = require('request')
const createInsertSqlFromObjectArray = require('./createInsertSqlFromObjectArray')

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
      // empty table
      app.db.none('TRUNCATE TABLE beob.adb_eigenschaften')
        .catch((err) =>
          console.log(err)
        )
        .then(() => {
          const eigenschaftenString = createInsertSqlFromObjectArray(body)
          const sqlBase = `
            INSERT INTO
              beob.adb_eigenschaften
              ("GUID", "TaxonomieId", "Familie", "Artname", "NameDeutsch", "Status", "Artwert", "KefArt", "KefKontrolljahr")
            VALUES `

          // add new values
          let sql = sqlBase + eigenschaftenString

          req.pg.client.query(
            sql,
            (err) => {
              if (err) throw err
              reply('Arteigenschaften hinzugefügt')
              req.pg.client.end()
            }
          )
        })
    }
  })
}
