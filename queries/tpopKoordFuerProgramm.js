'use strict'

const pg = require('pg')
const config = require('../configuration')
const connectionString = config.pg.connectionString

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  // Daten abfragen
  connection.query(`
    SELECT DISTINCT
      pop.ApArtId,
      pop.PopId,
      pop.PopNr,
      tpop.TPopId,
      tpop.TPopNr,
      tpop.TPopXKoord,
      tpop.TPopYKoord,
      tpop.TPopApBerichtRelevant
    FROM pop
      INNER JOIN tpop ON pop.PopId = tpop.PopId
    WHERE tpop.TPopXKoord Is Not Null
      AND tpop.TPopYKoord Is Not Null
      AND pop.ApArtId = ${apId}`,
    (err, data) => callback(err, data)
  )
}
