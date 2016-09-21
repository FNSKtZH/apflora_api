'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    "DomainCode",
    "DomainTxt"
  FROM
    apflora.tpopkontr_idbiotuebereinst_werte
  ORDER BY
    "DomainOrd"`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
