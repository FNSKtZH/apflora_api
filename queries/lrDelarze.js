'use strict'

const mysql = require('mysql')
var config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = function (request, callback) {
  connection.query(
    'SELECT Label AS id, CONCAT(Label, ": ", REPEAT(" ",(7-LENGTH(Label))), Einheit) AS Einheit FROM adb_lr WHERE LrMethodId = 1 ORDER BY Label',
    function (err, data) {
      callback(err, data)
    }
  )
}
