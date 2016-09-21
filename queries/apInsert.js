'use strict'

const app = require('ampersand-app')

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)
  const user = encodeURIComponent(request.params.user)
  const date = new Date().toISOString()

  app.db.task(function*(t) {
    // neuen AP einfügen
    const sqlInsert = `
      INSERT INTO
        apflora.ap ("ApArtId", "MutWann", "MutWer")
      VALUES
        (${apId}, '${date}', '${user}')
      ON CONFLICT DO NOTHING`
    yield app.db.none(sqlInsert)

    // Artwert holen
    const sqlGet = `
      SELECT
        "Artwert"
      FROM
        beob.adb_eigenschaften
      WHERE
        "TaxonomieId" = ${apId}`
    return yield app.db.oneOrNone(sqlGet)
  })
    .then((row) => {
      // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
      if (row && row.Artwert) {
        request.pg.client.query(`
          UPDATE
            apflora.ap
          SET
            "ApArtwert" = '${row.Artwert}'
          WHERE
            "ApArtId" = ${apId}`,
          (err, data) => callback(err, apId)
        )
      } else {
        callback(null, apId)
      }
    })
    .catch((error) =>
      callback(error, null)
    )
}
