'use strict'

var _ = require('underscore'),
  mysql = require('mysql'),
  config = require('../../configuration'),
  escapeStringForSql = require('../escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora_beob'
  })

function buildChildFromData (data) {
  var childrenArray = [],
    object

  _.each(data, function (beob) {
    object = {}
    var datum = beob.Datum || '(kein Datum)',
      autor = beob.Autor || '(kein Autor)'

    object.data = datum + ': ' + autor
    // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
    object.attr = {
      id: 'beob' + beob.NO_NOTE,
      typ: 'beobNichtZuzuordnen',
      beobtyp: beob.beobtyp
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  connection.query(
    'SELECT apflora_beob.beob_bereitgestellt.NO_ISFS, apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor, "infospezies" AS beobtyp FROM apflora.beobzuordnung INNER JOIN apflora_beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE WHERE apflora.beobzuordnung.NO_NOTE IS NOT NULL AND apflora.beobzuordnung.beobNichtZuordnen=1 AND apflora_beob.beob_bereitgestellt.NO_ISFS=' + apId + ' UNION SELECT apflora_beob.beob_bereitgestellt.NO_ISFS, apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor, "evab" AS beobtyp FROM apflora.beobzuordnung INNER JOIN apflora_beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET WHERE apflora.beobzuordnung.NO_NOTE IS NOT NULL AND apflora.beobzuordnung.beobNichtZuordnen=1 AND apflora_beob.beob_bereitgestellt.NO_ISFS=' + apId + ' ORDER BY Datum DESC LIMIT 100',
    function (err, data) {
      var node = {}

      if (err) { return reply(err) }

      if (data.length < 100) {
        node.data = 'nicht zuzuordnende Beobachtungen (' + data.length + ')'
      } else {
        node.data = 'nicht zuzuordnende Beobachtungen (neuste ' + data.length + ')'
      }

      node.attr = {
        id: 'apOrdnerBeobNichtZuzuordnen' + apId,
        typ: 'apOrdnerBeobNichtZuzuordnen'
      }
      node.children = buildChildFromData(data)

      reply(null, node)
    }
  )
}
