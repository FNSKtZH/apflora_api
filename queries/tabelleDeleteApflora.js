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
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, aus der die Daten gelöscht werden sollen
  var tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld) // das ist der Name der ID der Tabelle
  var tabelleId = escapeStringForSql(request.params.tabelleId) // der Wert der ID des zu löschenden Datensatzes

  connection.query(
    'DELETE FROM ' + tabelle + ' WHERE ' + tabelleIdFeld + '="' + tabelleId + '"',
    (err, data) => callback(err, data)
  )
}
