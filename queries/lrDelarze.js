'use strict'

module.exports = (request, callback) => {
  const sql = `
    SELECT
      "Label" AS id,
      CONCAT(
        "Label",
        ': ',
        repeat(' ', (7 - char_length("Label"))),
        "Einheit"
        ) AS "Einheit"
      FROM
        beob.adb_lr
      WHERE
        "LrMethodId" = 1
      ORDER BY
        "Label"`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
