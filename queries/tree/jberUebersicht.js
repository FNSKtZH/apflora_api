'use strict'

const mysql = require('mysql')
const config = require('../../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = (JBerJahr) => {
  connection.query(
    `SELECT JbuJahr FROM apberuebersicht WHERE JbuJahr = ${JBerJahr}`,
    (err, data) => {
      if (err) throw err
      if (data && data[0]) {
        data = data[0]
        const node = {
          data: 'Übersicht zu allen Arten',
          attr: {
            id: data.JbuJahr,
            typ: 'jberUebersicht'
          }
        }
        return [node]
      }
      return null
    }
  )
}
