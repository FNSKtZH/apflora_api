'use strict'

var _ = require('underscore'),
  erstellePopMassnBer = require('./popMassnBer')

module.exports = function (popMassnBerListe, pop) {
  var popMassnberOrdner = {},
    massnberVonPop,
    popMassnberNode

  // Liste der MassnBer dieser pop erstellen
  massnberVonPop = _.filter(popMassnBerListe, function (popMassnBer) {
    return popMassnBer.PopId === pop.PopId
  })

  // tpopOrdnerTpopber aufbauen
  popMassnberOrdner.data = 'Massnahmen-Berichte (' + massnberVonPop.length + ')'
  popMassnberOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerMassnber'
  }
  popMassnberOrdner.children = []

  // massnber aufbauen
  _.each(massnberVonPop, function (massnber) {
    popMassnberNode = erstellePopMassnBer(massnber)
    popMassnberOrdner.children.push(popMassnberNode)
  })

  return popMassnberOrdner
}
