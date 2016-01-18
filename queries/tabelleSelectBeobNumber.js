'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = (request, callback) => {
  var tabelle = escapeStringForSql(request.params.tabelle) // Name der Tabelle, aus der die Daten geholt werden sollen
  var feld = escapeStringForSql(request.params.feld) // Name der ID der Tabelle
  var wert = escapeStringForSql(request.params.wert) // Wert der ID
  const sql = 'SELECT * FROM ' + tabelle + ' WHERE ' + feld + '=' + wert

  console.log('tabelle', tabelle)
  console.log('feld', feld)
  console.log('wert', wert)
  console.log('sql', sql)

  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
