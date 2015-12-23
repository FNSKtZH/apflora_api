'use strict'

var _ = require('underscore'),
  erstelleTPopBeob = require('./tpopBeob')

var returnFunction = function (tpopBeobZugeordnetListe, tpop) {
  var tpopTpopBeobOrdner = {}
  var tpopbeobVonTpop
  var feldkontrNode

  // Liste der zugeordneten Beobachtungen dieser tpop erstellen
  tpopbeobVonTpop = _.filter(tpopBeobZugeordnetListe, function (tpopBeob) {
    return tpopBeob.TPopId === tpop.TPopId
  })

  // tpopOrdnerBeobZugeordnet aufbauen
  tpopTpopBeobOrdner.data = 'Beobachtungen (' + tpopbeobVonTpop.length + ')'
  tpopTpopBeobOrdner.attr = {
    id: 'tpopOrdnerBeobZugeordnet' + tpop.TPopId,
    typ: 'tpopOrdnerBeobZugeordnet'
  }
  tpopTpopBeobOrdner.children = []

  // tpopBeob aufbauen
  tpopbeobVonTpop.forEach(function (tpopBeob) {
    feldkontrNode = erstelleTPopBeob(tpopBeob)
    tpopTpopBeobOrdner.children.push(feldkontrNode)
  })

  return tpopTpopBeobOrdner
}

module.exports = returnFunction
