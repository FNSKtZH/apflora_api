'use strict'

const mysql = require('mysql')
var config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  connection.query(
    'SELECT GmdName FROM gemeinde ORDER BY GmdName',
    function (err, data) {
      callback(err, data)
    }
  )
}
