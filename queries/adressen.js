'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    "AdrId" AS id,
    "AdrName"
  FROM
    apflora.adresse
  ORDER BY
    "AdrName"`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(adressen => callback(null, adressen))
    .catch(error => callback(error, null))
