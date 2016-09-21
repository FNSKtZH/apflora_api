'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    "MassnTypCode" as id,
    "MassnTypTxt"
  FROM
    apflora.tpopmassn_typ_werte
  ORDER BY
    "MassnTypOrd"`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
