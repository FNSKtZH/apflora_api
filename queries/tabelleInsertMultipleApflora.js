/**
 * bekommt einen Datensatz von window.apf.deleted
 * stellt ihn wieder her
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
  var tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  var felder = request.params.felder                       // Ein Objekt mit allen feldern und deren Werten des wiederherzustellenden Datensatzes
  var sql
  var feldnamen
  var feldwerte

  felder = JSON.parse(felder)

  // Feldnamen und -werte extrahieren
  feldnamen = _.keys(felder).join()
  feldwerte = _.values(felder).join('","')

  // sql beginnen
  sql = 'INSERT INTO ' + tabelle + ' (' + feldnamen + ') VALUES ("' + feldwerte + '")'

  connection.query(
    sql,
    function (err, data) {
      callback(err, data.insertId)
    }
  )
}
