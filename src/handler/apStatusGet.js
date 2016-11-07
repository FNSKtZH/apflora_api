'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "DomainCode",
      "DomainTxt",
      "DomainOrd"
    FROM
      apflora.ap_bearbstand_werte
    ORDER BY
      "DomainOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
