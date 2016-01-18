'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const X = escapeStringForSql(request.params.X)
  const Y = escapeStringForSql(request.params.Y)

  connection.query(
    `SELECT PopNr, TPopNr, TPopId, TPopFlurname, SQRT((${X} - TPopXKoord) * (${X} - TPopXKoord) + (${Y} - TPopYKoord) * (${Y} - TPopYKoord)) AS DistZuTPop
    FROM pop INNER JOIN tpop ON pop.PopId = tpop.PopId
    WHERE ApArtId = ${apId} AND TPopXKoord IS NOT NULL AND TPopYKoord IS NOT NULL
    ORDER BY DistzuTPop LIMIT 1`,
    (err, data) => callback(err, data)
  )
}
