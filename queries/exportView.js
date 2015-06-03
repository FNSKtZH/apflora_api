'use strict'

var mysql = require('mysql'),
  _ = require('underscore'),
  config = require('../configuration'),
  escapeStringForSql = require('./escapeStringForSql'),
  connection = mysql.createConnection({
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
      _.each(data2, function (object) {
        _.each(object, function (value, key) {
          if (value === null) {
            object[key] = ''
          }
        })
      })
      callback(err, data2)
    }
  )
}
