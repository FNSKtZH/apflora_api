'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
    "AdrId" AS id,
    "AdrName"
  FROM
    apflora.adresse
  ORDER BY
    "AdrName"`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
