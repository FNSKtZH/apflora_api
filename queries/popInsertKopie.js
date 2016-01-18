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
  const apId = escapeStringForSql(request.params.apId)
  const popId = escapeStringForSql(request.params.popId)
  const user = escapeStringForSql(request.params.user) // der Benutzername
  const date = new Date().toISOString() // wann gespeichert wird

  // Zählungen der herkunfts-Kontrolle holen und der neuen Kontrolle anfügen
  const sql = `
    INSERT INTO pop (
      PopNr,
      PopName,
      PopHerkunft,
      PopHerkunftUnklar,
      PopHerkunftUnklarBegruendung,
      PopBekanntSeit,
      PopXKoord,
      PopYKoord,
      PopGuid,
      MutWann,
      MutWer,
      ApArtId
      )
    SELECT
      pop.PopNr,
      pop.PopName,
      pop.PopHerkunft,
      pop.PopHerkunftUnklar,
      pop.PopHerkunftUnklarBegruendung,
      pop.PopBekanntSeit,
      pop.PopXKoord,
      pop.PopYKoord,
      pop.PopGuid,
      "${date}",
      "${user}",
      ${apId}
    FROM pop
    WHERE pop.PopId = ${popId}`
  connection.query(
    sql,
    // neue Id zurück liefern
    (err, data) => callback(err, data.insertId)
  )
}
