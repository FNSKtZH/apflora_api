'use strict'

var _ = require('underscore')
var erstelleTPopFreiwKontr = require('./tpopFreiwkontr')

module.exports = function (tpopFreiwkontrListe, tpop) {
  var tpopFreiwkontrOrdner = {}
  var freiwkontrVonTpop
  var freiwkontrNode

  // Liste der Freiwkontrollen dieser tpop erstellen
  freiwkontrVonTpop = _.filter(tpopFreiwkontrListe, function (tpopFreiwkontr) {
    return tpopFreiwkontr.TPopId === tpop.TPopId
  })

  // tpopOrdnerFreiwkontr aufbauen
  tpopFreiwkontrOrdner.data = 'Freiwilligen-Kontrollen (' + freiwkontrVonTpop.length + ')'
  tpopFreiwkontrOrdner.attr = {
    id: 'tpopOrdnerFreiwkontr' + tpop.TPopId,
    typ: 'tpopOrdnerFreiwkontr'
  }
  tpopFreiwkontrOrdner.children = []

  // freiwkontr aufbauen
  freiwkontrVonTpop.forEach(function (freiwkontr) {
    freiwkontrNode = erstelleTPopFreiwKontr(freiwkontr)
    tpopFreiwkontrOrdner.children.push(freiwkontrNode)
  })

  return tpopFreiwkontrOrdner
}
