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
const connection2 = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = (request, callback) => {
  const apId = escapeStringForSql(request.params.apId)
  const user = escapeStringForSql(request.params.user)
  const date = new Date().toISOString()

  // neuen AP einfügen
  connection.query(
    `INSERT INTO apflora.ap (ApArtId, MutWann, MutWer) VALUES (${apId}, "${date}", "${user}")`,
    (err, data) => {
      if (err) callback(err, null)
      // Artwert holen
      connection2.query(
        `SELECT Artwert FROM apflora_beob.adb_eigenschaften WHERE TaxonomieId = ${apId}`,
        (err, data) => {
          // keine Fehler melden, wenn bloss der Artwert nicht geholt wurde
          if (data && data[0]) {
            const artwert = data[0]
            if (artwert) {
              connection.query(
                `UPDATE apflora.ap SET ApArtwert = "${artwert}" WHERE ApArtId = ${apId}`,
                (err, data) => callback(err, apId)
              )
            }
          } else {
            callback(err, null)
          }
        }
      )
    }
  )
}
