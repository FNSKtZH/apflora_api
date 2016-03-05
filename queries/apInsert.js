'use strict'

/*
 * need to test this with postgresql
 */

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const user = escapeStringForSql(request.params.user)
  const date = new Date().toISOString()

  // neuen AP einfügen
  request.pg.client.query(`
    INSERT INTO
      apflora.ap ("ApArtId", "MutWann", "MutWer")
    VALUES
      (${apId}, '${date}', '${user}')
    ON CONFLICT DO NOTHING`,
    (err, data) => {
      if (err) callback(err, null)
      // Artwert holen
      request.pg.client.query(`
        SELECT
          "Artwert"
        FROM
          beob.adb_eigenschaften
        WHERE
          "TaxonomieId" = ${apId}`,
        (err, data) => {
          // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
          if (data && data[0]) {
            const artwert = data[0]
            if (artwert) {
              request.pg.client.query(`
                UPDATE
                  apflora.ap
                SET
                  "ApArtwert" = '${artwert}'
                WHERE
                  "ApArtId" = ${apId}`,
                (err, data) => callback(err, apId)
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
