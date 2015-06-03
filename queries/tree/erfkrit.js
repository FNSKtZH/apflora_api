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
    beurteilText,
    erfkritText

  _.each(data, function (erfkrit) {
    beurteilText = erfkrit.BeurteilTxt || '(keine Beurteilung)'
    erfkritText = erfkrit.ErfkritTxt || '(kein Kriterium)'
    beschriftung = beurteilText + ': ' + erfkritText

    object = {}
    object.data = beschriftung

    // erfkrit voransetzen, damit die ID im ganzen Baum eindeutig ist
    object.attr = {
      id: erfkrit.ErfkritId,
      typ: 'erfkrit'
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  connection.query(
    'SELECT ErfkritId, ApArtId, BeurteilTxt, ErfkritTxt, BeurteilOrd FROM erfkrit LEFT JOIN ap_erfkrit_werte ON ErfkritErreichungsgrad = BeurteilId where ApArtId = ' + apId + ' ORDER BY BeurteilOrd',
    function (err, data) {
      var node = {}

      if (err) { return reply(err) }

      node.data = 'AP-Erfolgskriterien (' + data.length + ')'
      node.attr = {
        id: 'apOrdnerErfkrit' + apId,
        typ: 'apOrdnerErfkrit'
      }
      node.children = buildChildFromData(data)

      reply(null, node)
    }
  )
}
