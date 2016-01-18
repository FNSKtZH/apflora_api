'use strict'

const mysql = require('mysql')
const config = require('../configuration')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_beob'
})

module.exports = function (request, callback) {
  // Artname muss 'label' heissen, sonst funktioniert jquery ui autocomplete nicht
  connection.query(
    "SELECT TaxonomieId AS id, IF(Status NOT LIKE 'akzeptierter Name', CONCAT(Artname, ' (', Status, ')'), Artname) AS label FROM apflora_beob.adb_eigenschaften ORDER BY Artname",
    function (err, data) {
      callback(err, data)
    }
  )
}
