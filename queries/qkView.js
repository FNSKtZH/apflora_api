'use strict'

var mysql = require('mysql'),
  config = require('../configuration'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora_views'
  })

module.exports = function (request, callback) {
  var sql,
    viewName = request.params.viewName,
    apId = request.params.apId,
    berichtjahr = request.params.berichtjahr || null

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
    function (err, data) {
      callback(err, data)
    }
  )
}
