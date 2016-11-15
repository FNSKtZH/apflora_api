'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "MassnTypCode" AS "DomainCode",
      "MassnTypTxt" AS "DomainTxt"
    FROM
      apflora.tpopmassn_typ_werte
    ORDER BY
      "MassnTypOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
