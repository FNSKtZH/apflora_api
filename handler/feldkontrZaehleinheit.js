'use strict'

const app = require(`ampersand-app`)

const sql = `
  SELECT
    "ZaehleinheitCode" as value,
    "ZaehleinheitTxt" as label
  FROM
    apflora.tpopkontrzaehl_einheit_werte
  ORDER BY
    "ZaehleinheitOrd"`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
