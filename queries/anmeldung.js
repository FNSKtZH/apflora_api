'use strict'

var mysql = require('mysql')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, callback) {
  var userName = escapeStringForSql(request.params.name)
  var password = escapeStringForSql(request.params.pwd)

  connection.query(
    'SELECT NurLesen FROM user WHERE UserName = "' + userName + '" AND Passwort = "' + password + '"',
    function (err, data) {
      callback(err, data)
    }
  )
}
