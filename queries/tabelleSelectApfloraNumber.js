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
  var tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  var feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  var wert = escapeStringForSql(request.params.wert) // Wert der ID

  connection.query(
    'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '=' + wert,
    (err, data) => callback(err, data)
  )
}
