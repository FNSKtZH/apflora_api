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

  _.each(data, function (beob) {
    var datum = beob.Datum || '(kein Datum)',
      autor = beob.Autor || '(kein Autor)'

    object = {}
    object.data = datum + ': ' + autor
    // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
    object.attr = {
      typ: 'beobNichtBeurteilt'
    }

    if (beob.NO_NOTE) {
      object.attr.id = 'beob' + beob.NO_NOTE
      object.attr.beobtyp = 'infospezies'
    } else {
      object.attr.id = 'beob' + beob.NO_NOTE_PROJET
      object.attr.beobtyp = 'evab'
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  connection.query(
    'SELECT apflora_beob.beob_bereitgestellt.NO_NOTE, apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET, apflora_beob.beob_bereitgestellt.NO_ISFS, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor FROM (apflora_beob.beob_bereitgestellt LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_bereitgestellt.NO_NOTE = apflora.beobzuordnung.NO_NOTE) LEFT JOIN apflora.beobzuordnung AS tblBeobZuordnung_1 ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = tblBeobZuordnung_1.NO_NOTE WHERE apflora_beob.beob_bereitgestellt.NO_ISFS=' + apId + ' AND ((apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET Is Not Null AND tblBeobZuordnung_1.NO_NOTE Is Null) OR (apflora_beob.beob_bereitgestellt.NO_NOTE Is Not Null AND apflora.beobzuordnung.NO_NOTE Is Null)) ORDER BY apflora_beob.beob_bereitgestellt.Datum DESC LIMIT 100',
    function (err, data) {
      var node = {}

      if (err) { return reply(err) }

      if (data.length < 100) {
        node.data = 'nicht beurteilte Beobachtungen (' + data.length + ')'
      } else {
        node.data = 'nicht beurteilte Beobachtungen (neuste ' + data.length + ')'
      }
      node.attr = {
        id: 'apOrdnerBeobNichtBeurteilt' + apId,
        typ: 'apOrdnerBeobNichtBeurteilt'
      }
      node.children = buildChildFromData(data)
      reply(null, node)
    }
  )
}
