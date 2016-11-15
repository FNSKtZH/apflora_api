'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "ZieltypId" AS "DomainCode",
      "ZieltypTxt" AS "DomainTxt"
    FROM
      apflora.ziel_typ_werte
    ORDER BY
      "ZieltypOrd"`

  app.db.many(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
