'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_views'
})

module.exports = (request, callback) => {
  var sql
  var viewName = request.params.viewName
  var apId = request.params.apId
  var berichtjahr = request.params.berichtjahr || null

  // url setzen
  if (berichtjahr) {
    // if berichtjahr was passed, get only data of that year
    sql = 'SELECT * from ' + viewName + ' where ApArtId=' + apId + ' AND Berichtjahr=' + berichtjahr
  } else {
    sql = 'SELECT * from ' + viewName + ' where ApArtId=' + apId
  }

  // Daten abfragen
  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
