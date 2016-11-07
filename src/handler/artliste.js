'use strict'

const app = require(`ampersand-app`)

// Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
const sql = `
  SELECT
    "TaxonomieId" AS id,
    CASE
      WHEN "Status" NOT LIKE 'akzeptierter Name'
      THEN CONCAT("Artname", ' (', "Status", ')')
      ELSE "Artname"
    END AS label,
    "Artwert" as artwert
  FROM
    beob.adb_eigenschaften
  ORDER BY
    label`

module.exports = (request, callback) =>
  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
