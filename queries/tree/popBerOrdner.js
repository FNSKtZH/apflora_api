'use strict'

var _ = require('underscore'),
  erstellePopBer = require('./popBer')

module.exports = function (popBerListe, pop) {
  var popPopberOrdner = {},
    popberVonPop,
    popBerNode

  // Liste der Berichte dieser pop erstellen
  popberVonPop = _.filter(popBerListe, function (popBer) {
    return popBer.PopId === pop.PopId
  })

  // tpopOrdnerTpopber aufbauen
  popPopberOrdner.data = 'Populations-Berichte (' + popberVonPop.length + ')'
  popPopberOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerPopber'
  }
  popPopberOrdner.children = []

  // popber aufbauen
  _.each(popberVonPop, function (popber) {
    popBerNode = erstellePopBer(popber)
    popPopberOrdner.children.push(popBerNode)
  })

  return popPopberOrdner
}
