'use strict'

const erstelleTpopMassnOrdner = require('./tpopMassnOrdner')
const erstelleTpopMassnBerOrdner = require('./tpopMassnBerOrdner')
const erstelleTpopFeldkontrOrdner = require('./tpopFeldkontrOrdner')
const erstelleTpopFreiwkontrOrdner = require('./tpopFreiwkontrOrdner')
const erstelleTpopBerOrdner = require('./tpopBerOrdner')
const erstelleTpopBeobOrdner = require('./tpopBeobOrdner')

module.exports = (results, tpop) => {
  let tpopNodeText
  let tpopSort
  let tpopNodeChildren = []

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
  let tpopNode = {
    data: tpopNodeText,
    attr: {
      id: tpop.TPopId,
      typ: 'tpop',
      sort: tpopSort
    },
    children: tpopNodeChildren
  }

  // tpopOrdnerMassnahmen aufbauen
  const tpopMassnNode = erstelleTpopMassnOrdner(results.tpopMassnListe, tpop)
  tpopNodeChildren.push(tpopMassnNode)

  // tpopOrdnerMassnBer aufbauen
  const tpopMassnBerNode = erstelleTpopMassnBerOrdner(results.tpopMassnBerListe, tpop)
  tpopNodeChildren.push(tpopMassnBerNode)

  // tpopOrdnerFeldkontr aufbauen
  const tpopFeldkontrNode = erstelleTpopFeldkontrOrdner(results.tpopFeldkontrListe, tpop)
  tpopNodeChildren.push(tpopFeldkontrNode)

  // tpopOrdnerFreiwkontr aufbauen
  const tpopFreiwkontrNode = erstelleTpopFreiwkontrOrdner(results.tpopFreiwkontrListe, tpop)
  tpopNodeChildren.push(tpopFreiwkontrNode)

  // tpopOrdnerTpopber aufbauen
  const tpopBerNode = erstelleTpopBerOrdner(results.tpopBerListe, tpop)
  tpopNodeChildren.push(tpopBerNode)

  // tpopOrdnerBeobZugeordnet aufbauen
  const tpopBeobZugeordnetNode = erstelleTpopBeobOrdner(results.tpopBeobZugeordnetListe, tpop)
  tpopNodeChildren.push(tpopBeobZugeordnetNode)

  return tpopNode
}
