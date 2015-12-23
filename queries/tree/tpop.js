'use strict'

var erstelleTpopMassnOrdner = require('./tpopMassnOrdner')
var erstelleTpopMassnBerOrdner = require('./tpopMassnBerOrdner')
var erstelleTpopFeldkontrOrdner = require('./tpopFeldkontrOrdner')
var erstelleTpopFreiwkontrOrdner = require('./tpopFreiwkontrOrdner')
var erstelleTpopBerOrdner = require('./tpopBerOrdner')
var erstelleTpopBeobOrdner = require('./tpopBeobOrdner')

var returnFunction = function (results, tpop) {
  var tpopNode = {}
  var tpopNodeText
  var tpopSort
  var tpopNodeChildren = []
  var tpopMassnNode
  var tpopMassnBerNode
  var tpopFeldkontrNode
  var tpopFreiwkontrNode
  var tpopBerNode
  var tpopBeobZugeordnetNode

  // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
  if (tpop.TPopNr && tpop.TPopFlurname) {
    tpopNodeText = tpop.TPopNr + ': ' + tpop.TPopFlurname
    tpopSort = tpop.TPopNr
  } else if (tpop.PopBerJahr) {
    tpopNodeText = tpop.TPopNr + ': (kein Flurname)'
    tpopSort = tpop.TPopNr
  } else if (tpop.TPopFlurname) {
    tpopNodeText = '(keine Nr): ' + tpop.TPopFlurname
    tpopSort = 1000
  } else {
    tpopNodeText = '(keine Nr): (kein Flurname)'
    tpopSort = 1000
  }

  // node aufbauen
  tpopNode.data = tpopNodeText
  tpopNode.attr = {
    id: tpop.TPopId,
    typ: 'tpop',
    sort: tpopSort
  }
  tpopNode.children = tpopNodeChildren

  // tpopOrdnerMassnahmen aufbauen
  tpopMassnNode = erstelleTpopMassnOrdner(results.tpopMassnListe, tpop)
  tpopNodeChildren.push(tpopMassnNode)

  // tpopOrdnerMassnBer aufbauen
  tpopMassnBerNode = erstelleTpopMassnBerOrdner(results.tpopMassnBerListe, tpop)
  tpopNodeChildren.push(tpopMassnBerNode)

  // tpopOrdnerFeldkontr aufbauen
  tpopFeldkontrNode = erstelleTpopFeldkontrOrdner(results.tpopFeldkontrListe, tpop)
  tpopNodeChildren.push(tpopFeldkontrNode)

  // tpopOrdnerFreiwkontr aufbauen
  tpopFreiwkontrNode = erstelleTpopFreiwkontrOrdner(results.tpopFreiwkontrListe, tpop)
  tpopNodeChildren.push(tpopFreiwkontrNode)

  // tpopOrdnerTpopber aufbauen
  tpopBerNode = erstelleTpopBerOrdner(results.tpopBerListe, tpop)
  tpopNodeChildren.push(tpopBerNode)

  // tpopOrdnerBeobZugeordnet aufbauen
  tpopBeobZugeordnetNode = erstelleTpopBeobOrdner(results.tpopBeobZugeordnetListe, tpop)
  tpopNodeChildren.push(tpopBeobZugeordnetNode)

  return tpopNode
}

module.exports = returnFunction
