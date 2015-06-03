'use strict'

var _ = require('underscore'),
  erstelleTpopMassn = require('./tpopMassn')

module.exports = function (tpopMassnListe, tpop) {
  var tpopMassnOrdner = {},
    massnVonTpop,
    tpopMassnNode

  // Liste der Massnahmen dieser tpop erstellen
  massnVonTpop = _.filter(tpopMassnListe, function (tpopMassn) {
    return tpopMassn.TPopId === tpop.TPopId
  })

  // tpopOrdnerMassnahmen aufbauen
  tpopMassnOrdner.data = 'Massnahmen (' + massnVonTpop.length + ')'
  tpopMassnOrdner.attr = {
    id: 'tpopOrdnerMassn' + tpop.TPopId,
    typ: 'tpopOrdnerMassn'
  }
  tpopMassnOrdner.children = []

  // massn aufbauen
  _.each(massnVonTpop, function (massn) {
    tpopMassnNode = erstelleTpopMassn(massn)
    tpopMassnOrdner.children.push(tpopMassnNode)
  })

  return tpopMassnOrdner
}
