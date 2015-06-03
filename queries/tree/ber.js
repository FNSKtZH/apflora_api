'use strict'

var _ = require('underscore'),
  mysql = require('mysql'),
  config = require('../../configuration'),
  escapeStringForSql = require('../escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

function buildChildFromData (data) {
  var childrenArray = [],
    object,
    beschriftung,
    berjahrText,
    bertitelText

  _.each(data, function (ber) {
    berjahrText = ber.BerJahr || '(kein Jahr)'
    bertitelText = ber.BerTitel || '(kein Titel)'
    beschriftung = berjahrText + ': ' + bertitelText

    object = {}
    object.data = beschriftung
    object.attr = {
      id: ber.BerId,
      typ: 'ber'
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  connection.query(
    'SELECT BerId, ApArtId, BerJahr, BerTitel FROM ber where ApArtId =' + apId + ' ORDER BY BerJahr DESC, BerTitel',
    function (err, data) {
      var node

      if (err) { return reply(err) }

      node = {}
      node.data = 'Berichte (' + data.length + ')'
      node.attr = {
        id: 'apOrdnerBer' + apId,
        typ: 'apOrdnerBer'
      }
      node.children = buildChildFromData(data)

      reply(null, node)
    }
  )
}
