'use strict'

var _ = require('lodash')
var async = require('async')
var mysql = require('mysql')
var config = require('../../configuration')
var escapeStringForSql = require('../escapeStringForSql')
var connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})
var erstelleTpopOrdner = require('./tpopOrdner')
var erstellePopMassnBerOrdner = require('./popMassnBerOrdner')
var erstellePopBerOrdner = require('./popBerOrdner')

// erhält die höchste PopNr der Liste und die aktuelle
// stellt der aktuellen PopNr soviele Nullen voran, dass
// alle Nummern dieselbe Anzahl stellen haben
function ergaenzePopNrUmFuehrendeNullen (popNrMax, popNr) {
  /* jslint white: true, plusplus: true */
  if (!popNr && popNr !== 0) { return null }
  if (!popNrMax && popNrMax !== 0) { return null }

  // Nummern in Strings umwandeln
  popNrMax = popNrMax.toString()
  popNr = popNr.toString()

  var stellendifferenz = popNrMax.length - popNr.length

  // Voranzustellende Nullen generieren
  while (stellendifferenz > 0) {
    popNr = '0' + popNr
    stellendifferenz--
  }

  return popNr
}

module.exports = function (request, reply) {
  var apId = escapeStringForSql(request.params.apId)

  // zuerst die popliste holen
  async.waterfall([
    function (callback) {
      connection.query(
        'SELECT PopNr, PopName, PopId, ApArtId FROM pop where ApArtId = ' + apId + ' ORDER BY PopNr, PopName',
        function (err, result) {
          var popListe = result
          var popIds = _.map(popListe, 'PopId')
          callback(err, popIds, popListe)
        }
      )
    },
    function (popIds, popListe, callback) {
      if (popIds.length > 0) {
        connection.query(
          'SELECT TPopNr, TPopFlurname, TPopId, PopId FROM tpop where PopId in (' + popIds.join() + ') ORDER BY TPopNr, TPopFlurname',
          function (err, result) {
            var tpopListe = result
            var tpopIds = _.map(tpopListe, 'TPopId')
            callback(err, [popIds, tpopIds, popListe, tpopListe])
          }
        )
      } else {
        callback(null, [popIds, [], popListe, []])
      }
    }
  ], function (err, result) {
    var popIds = result[0]
    var tpopIds = result[1]
    var popListe = result[2]
    var tpopListe = result[3]
    var popOrdnerNode = {}

    if (tpopIds.length > 0) {
      // jetzt parallel alle übrigen Daten aus dem pop-baum
      async.parallel({
        tpopMassnListe: function (callback) {
          connection.query(
            'SELECT TPopMassnId, TPopId, TPopMassnJahr, TPopMassnDatum, MassnTypTxt FROM tpopmassn LEFT JOIN tpopmassn_typ_werte ON TPopMassnTyp = MassnTypCode where TPopId in (' + tpopIds.join() + ') ORDER BY TPopMassnJahr, TPopMassnDatum, MassnTypTxt',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        tpopMassnBerListe: function (callback) {
          connection.query(
            'SELECT TPopMassnBerId, TPopId, TPopMassnBerJahr, BeurteilTxt FROM tpopmassnber LEFT JOIN tpopmassn_erfbeurt_werte ON TPopMassnBerErfolgsbeurteilung = BeurteilId where TPopId in (' + tpopIds.join() + ') ORDER BY TPopMassnBerJahr, BeurteilTxt',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        tpopFeldkontrListe: function (callback) {
          connection.query(
            'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tpopkontr where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp<>"Freiwilligen-Erfolgskontrolle" OR TPopKontrTyp IS NULL) ORDER BY TPopKontrJahr, TPopKontrTyp',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        tpopFreiwkontrListe: function (callback) {
          connection.query(
            'SELECT TPopKontrId, TPopId, TPopKontrJahr, TPopKontrTyp FROM tpopkontr where (TPopId in (' + tpopIds.join() + ')) AND (TPopKontrTyp="Freiwilligen-Erfolgskontrolle") ORDER BY TPopKontrJahr, TPopKontrTyp',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        tpopBerListe: function (callback) {
          connection.query(
            'SELECT TPopBerId, TPopId, TPopBerJahr, EntwicklungTxt, EntwicklungOrd FROM tpopber LEFT JOIN tpop_entwicklung_werte ON TPopBerEntwicklung = EntwicklungCode where TPopId in (' + tpopIds.join() + ') ORDER BY TPopBerJahr, EntwicklungOrd',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        tpopBeobZugeordnetListe: function (callback) {
          connection.query(
            'SELECT apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.TPopId, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor, "evab" AS beobtyp FROM apflora.beobzuordnung INNER JOIN apflora_beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET WHERE apflora.beobzuordnung.TPopId in (' + tpopIds.join() + ') AND (apflora.beobzuordnung.beobNichtZuordnen=0 OR apflora.beobzuordnung.beobNichtZuordnen IS NULL) UNION SELECT apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.TPopId, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor, "infospezies" AS beobtyp FROM apflora.beobzuordnung INNER JOIN apflora_beob.beob_bereitgestellt ON CAST(apflora.beobzuordnung.NO_NOTE as CHAR(50)) = CAST(apflora_beob.beob_bereitgestellt.NO_NOTE as CHAR(50)) WHERE apflora.beobzuordnung.TPopId in (' + tpopIds.join() + ') AND (apflora.beobzuordnung.beobNichtZuordnen=0 OR apflora.beobzuordnung.beobNichtZuordnen IS NULL) ORDER BY Datum',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        popBerListe: function (callback) {
          connection.query(
            'SELECT PopBerId, PopId, PopBerJahr, EntwicklungTxt, EntwicklungOrd FROM popber LEFT JOIN pop_entwicklung_werte ON PopBerEntwicklung = EntwicklungId where PopId in (' + popIds.join() + ') ORDER BY PopBerJahr, EntwicklungOrd',
            function (err, data) {
              callback(err, data)
            }
          )
        },
        popMassnBerListe: function (callback) {
          connection.query(
            'SELECT PopMassnBerId, PopId, PopMassnBerJahr, BeurteilTxt, BeurteilOrd FROM popmassnber LEFT JOIN tpopmassn_erfbeurt_werte ON PopMassnBerErfolgsbeurteilung = BeurteilId where PopId in (' + popIds.join() + ') ORDER BY PopMassnBerJahr, BeurteilOrd',
            function (err, data) {
              callback(err, data)
            }
          )
        }
      }, function (err, results) {
        var popBerListe = results.popBerListe || []
        var popMassnBerListe = results.popMassnBerListe || []
        var popOrdnerNodeChildren
        var popNrMax

        if (err) { return reply(err) }

        // node für apOrdnerPop aufbauen
        popOrdnerNode.data = 'Populationen (' + popListe.length + ')'
        popOrdnerNode.attr = {
          id: 'apOrdnerPop' + apId,
          typ: 'apOrdnerPop'
        }
        popOrdnerNodeChildren = []
        popOrdnerNode.children = popOrdnerNodeChildren

        // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
        // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
        popNrMax = _.maxBy(popListe, function (pop) {
          return pop.PopNr
        }).PopNr

        popListe.forEach(function (pop) {
          var popNode = {}
          var popNodeChildren = []
          var popMassnberOrdnerNode
          var popBerOrdnerNode
          var popTpopOrdnerNode
          var data
          var popSort

          pop.PopNr = ergaenzePopNrUmFuehrendeNullen(popNrMax, pop.PopNr)

          // nodes für pop aufbauen
          if (pop.PopName && pop.PopNr) {
            data = pop.PopNr + ': ' + pop.PopName
            popSort = pop.PopNr
          } else if (pop.PopNr) {
            data = pop.PopNr + ': (kein Name)'
            popSort = pop.PopNr
          } else if (pop.PopName) {
            data = '(keine Nr): ' + pop.PopName
            // pop ohne Nummern zuunterst sortieren
            popSort = 1000
          } else {
            data = '(keine Nr, kein Name)'
            popSort = 1000
          }

          popNode.data = data
          popNode.attr = {
            id: pop.PopId,
            typ: 'pop',
            sort: popSort
          }
          // popNode.children ist ein Array, der enthält: popOrdnerTpop, popOrdnerPopber, popOrdnerMassnber
          popNode.children = popNodeChildren

          popOrdnerNodeChildren.push(popNode)

          // tpopOrdner aufbauen
          popTpopOrdnerNode = erstelleTpopOrdner(results, tpopListe, pop)
          popNodeChildren.push(popTpopOrdnerNode)

          // PopberOrdner aufbauen
          popBerOrdnerNode = erstellePopBerOrdner(popBerListe, pop)
          popNodeChildren.push(popBerOrdnerNode)

          // MassnberOrdner aufbauen
          popMassnberOrdnerNode = erstellePopMassnBerOrdner(popMassnBerListe, pop)
          popNodeChildren.push(popMassnberOrdnerNode)
        })
        reply(null, popOrdnerNode)
      })
    } else {
      // node für apOrdnerPop aufbauen
      popOrdnerNode.data = 'Populationen (0)'
      popOrdnerNode.attr = {
        id: 'apOrdnerPop' + apId,
        typ: 'apOrdnerPop'
      }
      popOrdnerNode.children = []
      reply(null, popOrdnerNode)
    }
  })
}
