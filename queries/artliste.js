'use strict'

module.exports = (request, callback) => {
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  const sql = `
    SELECT
      "TaxonomieId" AS id,
      CASE
        WHEN "Status" NOT LIKE 'akzeptierter Name'
        THEN CONCAT("Artname", ' (', "Status", ')')
        ELSE "Artname"
      END AS label
    FROM
      beob.adb_eigenschaften
    ORDER BY
      label`
  request.pg.client.query(sql, (error, result) => callback(error, result.rows))
}
