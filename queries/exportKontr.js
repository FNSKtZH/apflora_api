'use strict'

const mysql = require('mysql')
var _ = require('lodash')
var config = require('../configuration')
var escapeStringForSql = require('./escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora_views'
})

module.exports = function (request, callback) {
  var view = escapeStringForSql(request.params.view) // Name des Views, aus dem die Daten geholt werden sollen

  connection.query(
    'SELECT * FROM ' + view,
    function (err, data) {
      // null-werte eliminieren
      var data2 = data
      data2.forEach(function (object) {
        _.forEach(object, function (value, key) {
          if (value === null) object[key] = ''
        })
      })
      callback(err, data2)
    }
  )
}
