'use strict'

const erstelleTPopFeldKontr = require('./tpopFeldkontr')

module.exports = function (tpopFeldkontrListe, tpop) {
  let tpopFeldkontrOrdner = {}

  // Liste der Feldkontrollen dieser tpop erstellen
  const feldkontrVonTpop = tpopFeldkontrListe.filter(tpopFeldkontr => tpopFeldkontr.TPopId === tpop.TPopId)

  // tpopOrdnerFeldkontr aufbauen
  tpopFeldkontrOrdner.data = `Feldkontrollen (${feldkontrVonTpop.length})`
  tpopFeldkontrOrdner.attr = {
    id: 'tpopOrdnerFeldkontr' + tpop.TPopId,
    typ: 'tpopOrdnerFeldkontr'
  }
  tpopFeldkontrOrdner.children = []

  // feldkontr aufbauen
  feldkontrVonTpop.forEach(feldkontr => {
    const feldkontrNode = erstelleTPopFeldKontr(feldkontr)
    tpopFeldkontrOrdner.children.push(feldkontrNode)
  })

  return tpopFeldkontrOrdner
}
