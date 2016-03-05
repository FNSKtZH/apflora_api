'use strict'

const escapeStringForSql = require('./escapeStringForSql')

module.exports = (request, callback) => {
  const viewName = escapeStringForSql(request.params.viewName)
  const apId = escapeStringForSql(request.params.apId)
  const berichtjahr = escapeStringForSql(request.params.berichtjahr) || null

  // url setzen
  let sql
  if (berichtjahr) {
    // if berichtjahr was passed, get only data of that year
    sql = `
      SELECT *
      FROM
        views.${viewName}
      WHERE
        "ApArtId" = ${apId}
        AND "Berichtjahr" = ${berichtjahr}`
  } else {
    sql = `
      SELECT
        *
      FROM
        views.${viewName}
      WHERE
        "ApArtId" = ${apId}`
  }

  // Daten abfragen
  request.pg.client.query(
    sql,
    (err, data) => callback(err, data.rows)
  )
}
