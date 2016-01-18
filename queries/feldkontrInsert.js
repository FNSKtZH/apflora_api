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
  var tpopId = escapeStringForSql(request.params.tpopId) // die id
  var tpopKontrtyp = escapeStringForSql(request.params.tpopKontrtyp) // feldkontr oder freiwkontr
  var user = escapeStringForSql(request.params.user) // der Benutzername
  var date = new Date().toISOString() // wann gespeichert wird
  var sql

  // sql schreiben
  if (tpopKontrtyp === 'tpopfreiwkontr') {
    // Die Freiwilligen-Erfolgskontrolle erhält direkt einen Typ
    sql = 'INSERT INTO tpopkontr (TPopId, TPopKontrTyp, MutWann, MutWer) VALUES (' + tpopId + ', "Freiwilligen-Erfolgskontrolle", "' + date + '", "' + user + '")'
  } else {
    // die feldkontrolle erhält erst später einen Typ
    sql = 'INSERT INTO tpopkontr (TPopId, MutWann, MutWer) VALUES (' + tpopId + ', "' + date + '", "' + user + '")'
  }

  connection.query(
    sql,
    function (err, data) {
      callback(err, data.insertId)
    }
  )
}
