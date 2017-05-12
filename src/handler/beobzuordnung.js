'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)

  const sql = `
    SELECT
      apflora.beobzuordnung.*
    FROM
      apflora.beobzuordnung
      INNER JOIN
        beob.beob
        ON beob.beob."BeobId" = apflora.beobzuordnung."BeobId"
    WHERE
      beob.beob."ArtId" = ${apId};`

  app.db
    .any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
