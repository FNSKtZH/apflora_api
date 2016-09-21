'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)
  const user = encodeURIComponent(request.params.user)
  const date = new Date().toISOString()

  app.db.task(function* (t) {
    // neuen AP einfügen
    yield app.db.none(`
      INSERT INTO
        apflora.ap ("ApArtId", "MutWann", "MutWer")
      VALUES
        (${apId}, '${date}', '${user}')
      ON CONFLICT DO NOTHING`
    )

    // Artwert holen
    const artwertRow = yield app.db.oneOrNone(`
      SELECT
        "Artwert"
      FROM
        beob.adb_eigenschaften
      WHERE
        "TaxonomieId" = ${apId}`
    )

    if (artwertRow && artwertRow.Artwert) {
      // Artwert setzen
      yield app.db.none(`
        UPDATE
          apflora.ap
        SET
          "ApArtwert" = '${artwertRow.Artwert}'
        WHERE
          "ApArtId" = ${apId}`
      )
    }
    // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
    return
  })
    .then(row =>
      callback(null, apId)
    )
    .catch(error =>
      callback(error, null)
    )
}
