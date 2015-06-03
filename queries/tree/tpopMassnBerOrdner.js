'use strict'

var _ = require('underscore'),
  erstelleTPopMassnBer = require('./tpopMassnBer')

module.exports = function (tpopMassnBerListe, tpop) {
  var tpopMassnBerOrdner = {},
    massnberVonTpop,
    massnberNode

  // Liste der Massnahmen-Berichte dieser tpop erstellen
  massnberVonTpop = _.filter(tpopMassnBerListe, function (tpopMassnBer) {
    return tpopMassnBer.TPopId === tpop.TPopId
  })

  // tpopOrdnerMassnahmenBer aufbauen
  tpopMassnBerOrdner.data = 'Massnahmen-Berichte (' + massnberVonTpop.length + ')'
  tpopMassnBerOrdner.attr = {
    id: 'tpopOrdnerMassnber' + tpop.TPopId,
    typ: 'tpopOrdnerMassnber'
  }
  tpopMassnBerOrdner.children = []

  // massnber aufbauen
  _.each(massnberVonTpop, function (massnber) {
    massnberNode = erstelleTPopMassnBer(massnber)
    tpopMassnBerOrdner.children.push(massnberNode)
  })

  return tpopMassnBerOrdner
}
