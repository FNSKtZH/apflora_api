'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    "GmdName"
  FROM
    apflora.gemeinde
  ORDER BY
    "GmdName"`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
