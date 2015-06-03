'use strict'

var _ = require('underscore'),
  mysql = require('mysql'),
  async = require('async'),
  config = require('../../configuration'),
  escapeStringForSql = require('../escapeStringForSql'),
  connection = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  })

function buildChildForJBer (JBerJahr, jberUebersichtListe) {
  // zuerst den Datensatz extrahieren
  var jberUebersicht,
    object

  jberUebersicht = _.find(jberUebersichtListe, function (jberUebersicht) {
    return jberUebersicht.JbuJahr === JBerJahr
  })

  if (jberUebersicht) {
    object = {}
    object.data = 'Übersicht zu allen Arten'
    object.attr = {
      id: jberUebersicht.JbuJahr,
      typ: 'jberUebersicht'
    }
    return [object]
  }
  return null
}

function buildChildrenForJBerOrdner (results) {
  var childrenArray = [],
    object,
    beschriftung = '(kein Jahr)'

  _.each(results.jberListe, function (jber) {
    object = {}

    if (jber.JBerJahr) { beschriftung = jber.JBerJahr.toString() }
    object.data = beschriftung

    object.attr = {
      id: jber.JBerId,
      typ: 'jber'
    }

    if (jber.JBerJahr) {
      object.children = buildChildForJBer(jber.JBerJahr, results.jberUebersichtListe)
    }
    childrenArray.push(object)
  })

  return childrenArray
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  // query ber AND jberUebersicht first
  async.parallel({
    jberListe: function (callback) {
      connection.query(
        'SELECT JBerId, ApArtId, JBerJahr FROM apber where ApArtId = ' + apId + ' ORDER BY JBerJahr',
        function (err, jber) {
          callback(err, jber)
        }
      )
    },
    jberUebersichtListe: function (callback) {
      connection.query(
        'SELECT JbuJahr FROM apberuebersicht',
        function (err, jberUebersicht) {
          callback(err, jberUebersicht)
        }
      )
    }
  }, function (err, results) {
    var jberListe = results.jberListe,
      nodeChildren,
      node = {}

    if (err) { return reply(err) }

    node.data = 'AP-Berichte (' + jberListe.length + ')'
    node.attr = {
      id: 'apOrdnerJber' + apId,
      typ: 'apOrdnerJber'
    }
    nodeChildren = buildChildrenForJBerOrdner(results)
    node.children = nodeChildren

    reply(null, node)
  })
}
