'use strict'

var _ = require('underscore')
var mysql = require('mysql')
var async = require('async')
var config = require('../../configuration')
var escapeStringForSql = require('../escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)
  var zielIds

  // zuerst die Daten holen
  async.waterfall([
    function (callback) {
      connection.query(
        'SELECT ZielId, ZielTyp, ZielJahr, ZielBezeichnung FROM ziel WHERE ApArtId = ' + apId + ' ORDER BY ZielTyp, ZielBezeichnung',
        function (err, apzielListe) {
          if (err) { return callback(err) }
          callback(null, apzielListe)
        }
      )
    },
    function (apzielListe, callback) {
      // sicherstellen, dass eine apzielListe existiert - auf wenn sie leer ist
      apzielListe = apzielListe || []
      // Liste aller ZielId erstellen
      zielIds = _.pluck(apzielListe, 'ZielId')
      connection.query(
        'SELECT ZielBerId, ZielId, ZielBerJahr, ZielBerErreichung FROM zielber where ZielId in (' + zielIds.join() + ') ORDER BY ZielBerJahr, ZielBerErreichung',
        function (err, zielberListe) {
          if (err) { return callback(err) }
          // das Ergebnis der vorigen Abfrage anfügen
          var resultArray = [apzielListe, zielberListe]
          callback(null, resultArray)
        }
      )
    }
  ], function (err, result) {
    if (result) {
      var apzielListe = result[0] || []
      var zielberListe = result[1] || []
      var apzieljahre
      var apziele
      var zielbere
      var apzieleOrdnerNode = {}
      var apzieleOrdnerNodeChildren = []
      var apzieljahrNode = {}
      var apzieljahrNodeChildren = []
      var apzielNode = {}
      var apzielNodeChildren = []
      var apzielOrdnerNode = {}
      var apzielOrdnerNodeChildren = []
      var zielberNode = {}

      // in der apzielliste alls ZielJahr NULL mit '(kein Jahr)' ersetzen
      _.each(apzielListe, function (apziel) {
        apziel.ZielJahr = apziel.ZielJahr || '(kein Jahr)'
      })

      apzieljahre = _.union(_.pluck(apzielListe, 'ZielJahr'))
      // nodes für apzieljahre aufbauen
      apzieleOrdnerNode.data = 'AP-Ziele (' + apzielListe.length + ')'
      apzieleOrdnerNode.attr = {
        id: 'apOrdnerApziel' + apId,
        typ: 'apOrdnerApziel'
      }
      apzieleOrdnerNodeChildren = []
      apzieleOrdnerNode.children = apzieleOrdnerNodeChildren

      _.each(apzieljahre, function (zielJahr) {
        apziele = _.filter(apzielListe, function (apziel) {
          return apziel.ZielJahr === zielJahr
        })
        // nodes für apziele aufbauen
        apzieljahrNode = {}
        apzieljahrNode.data = zielJahr + ' (' + apziele.length + ')'
        apzieljahrNode.metadata = [apId]
        apzieljahrNode.attr = {
          id: apId,
          typ: 'apzieljahr'
        }
        apzieljahrNodeChildren = []
        apzieljahrNode.children = apzieljahrNodeChildren
        apzieleOrdnerNodeChildren.push(apzieljahrNode)

        _.each(apziele, function (apziel) {
          zielbere = _.filter(zielberListe, function (zielber) {
            return zielber.ZielId === apziel.ZielId
          })
          // node für apziele aufbauen
          apzielNode = {}
          apzielNode.data = apziel.ZielBezeichnung || '(Ziel nicht beschrieben)'
          apzielNode.attr = {
            id: apziel.ZielId,
            typ: 'apziel'
          }
          apzielNodeChildren = []
          apzielNode.children = apzielNodeChildren
          apzieljahrNodeChildren.push(apzielNode)

          // ...und gleich seinen node für zielber-Ordner aufbauen
          apzielOrdnerNode = {}
          apzielOrdnerNode.data = 'Ziel-Berichte (' + zielbere.length + ')'
          apzielOrdnerNode.attr = {
            id: apziel.ZielId,
            typ: 'zielberOrdner'
          }
          apzielOrdnerNodeChildren = []
          apzielOrdnerNode.children = apzielOrdnerNodeChildren
          apzielNodeChildren.push(apzielOrdnerNode)

          _.each(zielbere, function (zielber) {
            var data = ''
            if (zielber.ZielBerJahr && zielber.ZielBerErreichung) {
              data = zielber.ZielBerJahr + ': ' + zielber.ZielBerErreichung
            } else if (zielber.ZielBerJahr) {
              data = zielber.ZielBerJahr + ': (keine Entwicklung)'
            } else if (zielber.ZielBerErreichung) {
              data = '(kein jahr): ' + zielber.ZielBerErreichung
            } else {
              data = '(kein jahr): (keine Entwicklung)'
            }
            // nodes für zielbere aufbauen
            zielberNode = {}
            zielberNode.data = data
            zielberNode.attr = {
              id: zielber.ZielBerId,
              typ: 'zielber'
            }
            apzielOrdnerNodeChildren.push(zielberNode)
          })
        })
      })
      reply(null, apzieleOrdnerNode)
    } else {
      reply(null, {})
    }
  })
}
