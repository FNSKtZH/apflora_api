'use strict'

const erstelleTpop = require('./tpop')

module.exports = function (results, tpopListe, pop) {
  let popTpopOrdner = {}

  // Liste der tpop dieser pop erstellen
  const tpopVonPop = tpopListe.filter(tpop => tpop.PopId === pop.PopId)

  // tpopOrdnerTpop aufbauen
  popTpopOrdner.data = `Teilpopulationen (${tpopVonPop.length})`
  popTpopOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerTpop'
  }
  popTpopOrdner.children = []

  // tpop aufbauen
  tpopVonPop.forEach(tpop => {
    const tpopNode = erstelleTpop(results, tpop)
    popTpopOrdner.children.push(tpopNode)
  })

  return popTpopOrdner
}
