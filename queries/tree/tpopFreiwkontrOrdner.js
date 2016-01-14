'use strict'

const erstelleTPopFreiwKontr = require('./tpopFreiwkontr')

module.exports = function (tpopFreiwkontrListe, tpop) {
  let tpopFreiwkontrOrdner = {}

  // Liste der Freiwkontrollen dieser tpop erstellen
  const freiwkontrVonTpop = tpopFreiwkontrListe.filter(tpopFreiwkontr => tpopFreiwkontr.TPopId === tpop.TPopId)

  // tpopOrdnerFreiwkontr aufbauen
  tpopFreiwkontrOrdner.data = `Freiwilligen-Kontrollen (${freiwkontrVonTpop.length})`
  tpopFreiwkontrOrdner.attr = {
    id: 'tpopOrdnerFreiwkontr' + tpop.TPopId,
    typ: 'tpopOrdnerFreiwkontr'
  }
  tpopFreiwkontrOrdner.children = []

  // freiwkontr aufbauen
  freiwkontrVonTpop.forEach(freiwkontr => {
    const freiwkontrNode = erstelleTPopFreiwKontr(freiwkontr)
    tpopFreiwkontrOrdner.children.push(freiwkontrNode)
  })

  return tpopFreiwkontrOrdner
}
