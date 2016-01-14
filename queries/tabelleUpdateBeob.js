/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict'

const mysql = require('mysql')
const _ = require('lodash')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  const tabelleIdFeld = escapeStringForSql(request.params.tabelleIdFeld) // das ist der Name der ID der Tabelle
  const tabelleId = escapeStringForSql(request.params.tabelleId) // der Wert der ID
  const feld = escapeStringForSql(request.params.feld) // der Name des Felds, dessen Daten gespeichert werden sollen
  const wert = escapeStringForSql(request.params.wert) // der Wert, der gespeichert werden soll
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  const table = _.find(config.tables, {tabelleInDb: tabelle}) // Infos über die Tabelle holen
  const mutWannFeld = table.mutWannFeld // so heisst das Feld für MutWann
  const mutWerFeld = table.mutWerFeld // so heisst das Feld für MutWer

  let sql = `UPDATE ${tabelle} SET ${feld} = "${wert}", ${mutWannFeld} = "${date}", ${mutWerFeld} = "${user}" WHERE ${tabelleIdFeld} = ${tabelleId}`
  // Ist ein Feld neu leer, muss NULL übergeben werden. wert ist dann 'undefined'
  if (!wert) {
    sql = `UPDATE ${tabelle} SET ${feld} = NULL, ${mutWannFeld} = "${date}", ${mutWerFeld} = "${user}" WHERE ${tabelleIdFeld} = ${tabelleId}`
  }

  connection.query(
    sql,
    (err, data) => callback(err, data)
  )
}
