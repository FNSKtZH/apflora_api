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
    'SELECT MassnTypCode as id, MassnTypTxt FROM tpopmassn_typ_werte ORDER BY MassnTypOrd',
    function (err, data) {
      callback(err, data)
    }
  )
}
