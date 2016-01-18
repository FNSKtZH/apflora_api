'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_views'
})

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
      FROM ${viewName}
      WHERE ApArtId = ${apId}
        AND Berichtjahr = ${berichtjahr}`
  } else {
    sql = `
      SELECT *
      FROM ${viewName}
      WHERE ApArtId = ${apId}`
  }

  // Daten abfragen
  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
