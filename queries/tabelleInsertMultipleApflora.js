/**
 * bekommt einen Datensatz von window.apf.deleted
 * stellt ihn wieder her
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
  database: 'apflora'
})

module.exports = (request, callback) => {
  const tabelle = escapeStringForSql(request.params.tabelle) // der Name der Tabelle, in der die Daten gespeichert werden sollen
  let felder = request.params.felder // Ein Objekt mit allen feldern und deren Werten des wiederherzustellenden Datensatzes

  felder = JSON.parse(felder)

  // Feldnamen und -werte extrahieren
  const feldnamen = Object.keys(felder).join()
  const feldwerte = _.values(felder).join('","')

  // sql beginnen
  const sql = `INSERT INTO ${tabelle} (${feldnamen}) VALUES ("${feldwerte}")`

  connection.query(
    sql,
    (err, data) => callback(err, data.insertId)
  )
}
