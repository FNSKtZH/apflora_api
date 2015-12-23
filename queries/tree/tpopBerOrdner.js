'use strict'

var _ = require('underscore')
var erstelleTPopBer = require('./tpopBer')

var returnFunction = function (tpopBerListe, tpop) {
  var tpopTpopberOrdner = {}
  var tpopberVonTpop
  var tpopBerNode

  // Liste der Berichte dieser tpop erstellen
  tpopberVonTpop = _.filter(tpopBerListe, function (tpopBer) {
    return tpopBer.TPopId === tpop.TPopId
  })

  // tpopOrdnerTpopber aufbauen
  tpopTpopberOrdner.data = 'Teilpopulations-Berichte (' + tpopberVonTpop.length + ')'
  tpopTpopberOrdner.attr = {
    id: 'tpopOrdnerTpopber' + tpop.TPopId,
    typ: 'tpopOrdnerTpopber'
  }
  tpopTpopberOrdner.children = []

  // tpopber aufbauen
  tpopberVonTpop.forEach(function (tpopber) {
    tpopBerNode = erstelleTPopBer(tpopber)
    tpopTpopberOrdner.children.push(tpopBerNode)
  })

  return tpopTpopberOrdner
}

module.exports = returnFunction
