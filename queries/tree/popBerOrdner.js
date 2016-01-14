'use strict'

const erstellePopBer = require('./popBer')

module.exports = function (popBerListe, pop) {
  let popPopberOrdner = {}

  // Liste der Berichte dieser pop erstellen
  const popberVonPop = popBerListe.filter(popBer => popBer.PopId === pop.PopId)

  // tpopOrdnerTpopber aufbauen
  popPopberOrdner.data = `Populations-Berichte (${popberVonPop.length})`
  popPopberOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerPopber'
  }
  popPopberOrdner.children = []

  // popber aufbauen
  popberVonPop.forEach(popber => {
    const popBerNode = erstellePopBer(popber)
    popPopberOrdner.children.push(popBerNode)
  })

  return popPopberOrdner
}
