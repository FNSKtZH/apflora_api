'use strict'

var _ = require('underscore'),
  erstelleTpop = require('./tpop')

module.exports = function (results, tpopListe, pop) {
  var popTpopOrdner = {},
    tpopVonPop

  // Liste der tpop dieser pop erstellen
  tpopVonPop = _.filter(tpopListe, function (tpop) {
    return tpop.PopId === pop.PopId
  })

  // tpopOrdnerTpop aufbauen
  popTpopOrdner.data = 'Teilpopulationen (' + tpopVonPop.length + ')'
  popTpopOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerTpop'
  }
  popTpopOrdner.children = []

  // tpop aufbauen
  _.each(tpopVonPop, function (tpop) {
    var tpopNode = erstelleTpop(results, tpop)
    popTpopOrdner.children.push(tpopNode)
  })

  return popTpopOrdner
}
