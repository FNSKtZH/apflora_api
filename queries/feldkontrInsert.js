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
  const tpopId = escapeStringForSql(request.params.tpopId) // die id
  const tpopKontrtyp = escapeStringForSql(request.params.tpopKontrtyp) // feldkontr oder freiwkontr
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird
  let sql = `INSERT INTO tpopkontr (TPopId, MutWann, MutWer) VALUES (${tpopId}, "${date}", "${user}")`

  // sql schreiben
  if (tpopKontrtyp === 'tpopfreiwkontr') {
    sql = `INSERT INTO tpopkontr (TPopId, TPopKontrTyp, MutWann, MutWer) VALUES (${tpopId}, "Freiwilligen-Erfolgskontrolle", "${date}", "${user}")`
  }

  connection.query(
    sql,
    (err, data) => callback(err, data.insertId)
  )
}
