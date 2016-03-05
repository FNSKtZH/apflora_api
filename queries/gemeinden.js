'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "GmdName"
    FROM
      apflora.gemeinde
    ORDER BY
      "GmdName"`
  request.pg.client.query(sql, (error, result) => {
    callback(error, result.rows)
  })
}
