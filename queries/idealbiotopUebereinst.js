'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "DomainCode",
      "DomainTxt"
    FROM
      apflora.tpopkontr_idbiotuebereinst_werte
    ORDER BY
      "DomainOrd"`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
