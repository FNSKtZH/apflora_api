'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "MassnTypCode" as id,
      "MassnTypTxt"
    FROM
      apflora.tpopmassn_typ_werte
    ORDER BY
      "MassnTypOrd"`

  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
