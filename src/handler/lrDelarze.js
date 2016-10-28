'use strict'

const app = require(`ampersand-app`)

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

module.exports = (request, callback) => {
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
