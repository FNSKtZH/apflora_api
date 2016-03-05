'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "ZaehleinheitCode" as value,
      "ZaehleinheitTxt" as label
    FROM
      apflora.tpopkontrzaehl_einheit_werte
    ORDER BY
      "ZaehleinheitOrd"`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
