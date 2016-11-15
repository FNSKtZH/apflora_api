'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "BeurteilCode" AS "DomainCode",
      "BeurteilTxt" AS "DomainTxt"
    FROM
      apflora.tpopkontrzaehl_methode_werte
    ORDER BY
      "BeurteilOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
