'use strict'

const mysql = require('mysql')
const _ = require('lodash')
const config = require('../configuration')
const escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_views'
})

module.exports = (request, callback) => {
  const view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen
  const idName = escapeStringForSql(request.params.idName) // name des Felds, für den ID's übergeben werden
  const idListe = escapeStringForSql(request.params.idListe) // liste der ID's
  const sql = `SELECT * FROM ${view} WHERE ${idName} IN (${idListe})`

  connection.query(
    sql,
    (err, data) => {
      // null-werte eliminieren
      data.forEach((object) => {
        _.forEach(object, (value, key) => {
          if (value === null) object[key] = ''
        })
      })
      callback(err, data)
    }
  )
}
