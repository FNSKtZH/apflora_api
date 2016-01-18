'use strict'

const mysql = require('mysql')
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

  connection.query(
    `SELECT * FROM ${view}`,
    (err, data) => {
      // null-werte eliminieren
      data.forEach(object => {
        Object.keys(object).forEach((key) => {
          if (object[key] === null) object[key] = ''
        })
      })
      callback(err, data)
    }
  )
}
