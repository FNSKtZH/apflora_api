'use strict'

// reporting too long lines with option "ignoreTemplateLiterals": true is a bug in eslint
// a pull request was accepted but no new release yet built
// so disable max-len temporarily
/* eslint-disable max-len */

const app = require(`ampersand-app`)
const request = require(`request`)
const createInsertSqlFromObjectArray = require(`./createInsertSqlFromObjectArray`)

module.exports = (req, callback) => {
  // neue Daten holen
  request({
    method: `GET`,
    uri: `http://arteigenschaften.ch/artendb/_design/artendb/_list/export_apflora/flora?include_docs=true`,
    json: true
  }, (error, response, body) => {
    if (error) throw error
    if (response && response.statusCode === 200) {
      app.db.tx(function* manageData() {
        yield app.db.none(`TRUNCATE TABLE beob.adb_eigenschaften`)
        const eigenschaftenString = createInsertSqlFromObjectArray(body)
        const sqlBase = `
          INSERT INTO
            beob.adb_eigenschaften
            ("GUID", "TaxonomieId", "Familie", "Artname", "NameDeutsch", "Status", "Artwert", "KefArt", "KefKontrolljahr")
          VALUES `
        // add new values
        const sql = sqlBase + eigenschaftenString
        return yield app.db.none(sql)
      })
        .then(() => callback(null, `Arteigenschaften hinzugefügt`))
        .catch(err => callback(err, null))
    }
  })
}
