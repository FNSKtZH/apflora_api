'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "BeurteilId" AS "DomainCode",
      "BeurteilTxt" AS "DomainTxt"
    FROM
      apflora.ap_erfkrit_werte
    ORDER BY
      "BeurteilOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
