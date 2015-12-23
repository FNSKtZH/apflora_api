'use strict'

var _ = require('underscore'),
  erstelleTPopFeldKontr = require('./tpopFeldkontr')

module.exports = function (tpopFeldkontrListe, tpop) {
  var tpopFeldkontrOrdner = {}
  var feldkontrVonTpop
  var feldkontrNode

  // Liste der Feldkontrollen dieser tpop erstellen
  feldkontrVonTpop = _.filter(tpopFeldkontrListe, function (tpopFeldkontr) {
    return tpopFeldkontr.TPopId === tpop.TPopId
  })

  // tpopOrdnerFeldkontr aufbauen
  tpopFeldkontrOrdner.data = 'Feldkontrollen (' + feldkontrVonTpop.length + ')'
  tpopFeldkontrOrdner.attr = {
    id: 'tpopOrdnerFeldkontr' + tpop.TPopId,
    typ: 'tpopOrdnerFeldkontr'
  }
  tpopFeldkontrOrdner.children = []

  // feldkontr aufbauen
  _.each(feldkontrVonTpop, function (feldkontr) {
    feldkontrNode = erstelleTPopFeldKontr(feldkontr)
    tpopFeldkontrOrdner.children.push(feldkontrNode)
  })

  return tpopFeldkontrOrdner
}
