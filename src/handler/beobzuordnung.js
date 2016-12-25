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
        beob.beob_bereitgestellt
        ON beob.beob_bereitgestellt."BeobId" = apflora.beobzuordnung."NO_NOTE"
    WHERE
      beob.beob_bereitgestellt."NO_ISFS" = ${apId};`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
