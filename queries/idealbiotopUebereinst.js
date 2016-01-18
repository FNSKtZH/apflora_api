'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = (request, callback) => {
  connection.query(
    `SELECT
      DomainCode,
      DomainTxt
    FROM tpopkontr_idbiotuebereinst_werte
    ORDER BY DomainOrd`,
    (err, data) => callback(err, data)
  )
}
