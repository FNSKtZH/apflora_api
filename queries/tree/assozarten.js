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
    object

  _.each(data, function (assArt) {
    object = {}
    object.data = assArt.Artname || '(keine Art gewählt)'
    object.attr = {
      id: assArt.AaId,
      typ: 'assozarten'
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId),
    response

  connection.query(
    'SELECT AaId, apflora_beob.adb_eigenschaften.Artname FROM assozart LEFT JOIN apflora_beob.adb_eigenschaften ON AaSisfNr = apflora_beob.adb_eigenschaften.TaxonomieId where AaApArtId = ' + apId + ' ORDER BY apflora_beob.adb_eigenschaften.Artname',
    function (err, data) {
      if (err) { return reply(err) }
      response = {}
      response.data = 'assoziierte Arten (' + data.length + ')'
      response.attr = {
        id: 'apOrdnerAssozarten' + apId,
        typ: 'apOrdnerAssozarten'
      }
      response.children = buildChildFromData(data)
      reply(null, response)
    }
  )
}
