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

module.exports = function (request, callback) {
  var apId = escapeStringForSql(request.params.apId)
  var popId = escapeStringForSql(request.params.popId)
  var user = escapeStringForSql(request.params.user) // der Benutzername
  var date = new Date().toISOString() // wann gespeichert wird
  var sql = ''

  // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
  sql += 'INSERT INTO pop (PopNr, PopName, PopHerkunft, PopHerkunftUnklar, PopHerkunftUnklarBegruendung, PopBekanntSeit, PopXKoord, PopYKoord, PopGuid, MutWann, MutWer, ApArtId)'
  sql += ' SELECT pop.PopNr, pop.PopName, pop.PopHerkunft, pop.PopHerkunftUnklar, pop.PopHerkunftUnklarBegruendung, pop.PopBekanntSeit, pop.PopXKoord, pop.PopYKoord, pop.PopGuid, "' + date + '", "' + user + '", ' + apId
  sql += ' FROM pop'
  sql += ' WHERE pop.PopId=' + popId
  connection.query(
    sql,
    function (err, data) {
      // neue Id zurück liefern
      callback(err, data.insertId)
    }
  )
}
