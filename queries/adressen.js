'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  connection.query(
    'SELECT AdrId AS id, AdrName FROM adresse ORDER BY AdrName',
    function (err, data) {
      callback(err, data)
    }
  )
}
