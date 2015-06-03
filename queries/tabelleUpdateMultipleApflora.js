/**
 * aktualisiert ein Feld in einer Tabelle
 * Namen von Tabelle und Feld werden übermittelt
 */

'use strict'

var mysql = require('mysql'),
  _ = require('underscore'),
  config = require('../configuration'),
  escapeStringForSql = require('./escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  var tabelle = escapeStringForSql(request.params.tabelle),           // der Name der Tabelle, in der die Daten gespeichert werden sollen
    felder = request.params.felder,                                   // Ein Objekt mit allen feldern und deren Werten. PLUS: der id
    date = new Date().toISOString(),                                  // wann gespeichert wird
    sql,
    id,
    configTable = _.findWhere(config.tables, {tabelleInDb: tabelle}), // die table in der Konfiguration, welche die Informationen dieser Tabelle enthält
    nameMutwannFeld = configTable.mutWannFeld || 'MutWann',           // so heisst das MutWann-Feld in dieser Tabelle
    nameMutWerFeld = configTable.mutWerFeld || 'MutWer',              // so heisst das MutWer-Feld in dieser Tabelle
    tabelleIdFeld = configTable.tabelleIdFeld                         // so heisst das Schlüsselfeld dieser Tabelle

  felder = JSON.parse(felder)

  // id wird nur für die WHERE-Klausel benutzt
  id = felder.id
  delete felder.id

  // user wird nur für update-Klausel benutzt
  delete felder.user

  // sql beginnen
  sql = 'UPDATE ' + tabelle + ' SET ' + nameMutwannFeld + '="' + date + '", ' + nameMutWerFeld + '="' + felder.user + '"'

  // jetzt für jedes key/value-Paar des Objekts set-Anweisungen generieren
  _.each(felder, function (feldwert, feldname) {
    if (feldwert || feldwert === 0) {
      // in Zeichenfeldern Anführungszeichen eliminieren!
      if (typeof feldwert === 'string') {
        feldwert = feldwert.replace('"', '')
      }
      sql += ',' + feldname + '="' + feldwert + '"'
    } else {
      // leeres Feld: Null speichern, sonst werden aus Nullwerten in Zahlenfeldern 0 gemacht
      sql += ',' + feldname + '=NULL'
    }
  })

  sql += ' WHERE ' + tabelleIdFeld + '=' + id

  connection.query(
    sql,
    function (err, data) {
      callback(err, data)
    }
  )
}
