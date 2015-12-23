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
  var view = escapeStringForSql(request.params.view)    // Name des Views, aus dem die Daten geholt werden sollen
  var idName = escapeStringForSql(request.params.idName)  // name des Felds, für den ID's übergeben werden
  var idListe = escapeStringForSql(request.params.idListe) // liste der ID's
  var sql = 'SELECT * FROM ' + view + ' WHERE `' + idName + '` IN (' + idListe + ')'

  connection.query(
    sql,
    function (err, data) {
      // null-werte eliminieren
      var data2 = data
      data2.forEach(function (object) {
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
