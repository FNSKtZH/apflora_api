'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "ZaehleinheitCode" AS "DomainCode",
      "ZaehleinheitTxt" AS "DomainTxt"
    FROM
      apflora.tpopkontrzaehl_einheit_werte
    ORDER BY
      "ZaehleinheitOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
