'use strict'

const erstelleTPopBer = require('./tpopBer')

module.exports = function (tpopBerListe, tpop) {
  let tpopTpopberOrdner = {}

  // Liste der Berichte dieser tpop erstellen
  const tpopberVonTpop = tpopBerListe.filter(tpopBer => tpopBer.TPopId === tpop.TPopId)

  // tpopOrdnerTpopber aufbauen
  tpopTpopberOrdner.data = `Teilpopulations-Berichte (${tpopberVonTpop.length})`
  tpopTpopberOrdner.attr = {
    id: 'tpopOrdnerTpopber' + tpop.TPopId,
    typ: 'tpopOrdnerTpopber'
  }
  tpopTpopberOrdner.children = []

  // tpopber aufbauen
  tpopberVonTpop.forEach(function (tpopber) {
    const tpopBerNode = erstelleTPopBer(tpopber)
    tpopTpopberOrdner.children.push(tpopBerNode)
  })

  return tpopTpopberOrdner
}
