'use strict'

const app = require('ampersand-app')

module.exports = (request, callback) => {
  const sql = `
    SELECT
    "AdrId" AS id,
    "AdrName"
  FROM
    apflora.adresse
  ORDER BY
    "AdrName"`

  app.db.many(sql)
    .then((adressen) =>
      callback(null, adressen)
    )
    .catch((error) =>
      callback(error, null)
    )
}
