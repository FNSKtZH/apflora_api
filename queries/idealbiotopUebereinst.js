'use strict'

var mysql = require('mysql'),
  config = require('../configuration'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

module.exports = function (request, callback) {
  connection.query(
    'SELECT DomainCode, DomainTxt FROM tpopkontr_idbiotuebereinst_werte ORDER BY DomainOrd',
    function (err, data) {
      callback(err, data)
    }
  )
}
