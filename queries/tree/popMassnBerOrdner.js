'use strict'

const erstellePopMassnBer = require('./popMassnBer')

module.exports = function (popMassnBerListe, pop) {
  let popMassnberOrdner = {}

  // Liste der MassnBer dieser pop erstellen
  const massnberVonPop = popMassnBerListe.filter(popMassnBer => popMassnBer.PopId === pop.PopId)

  // tpopOrdnerTpopber aufbauen
  popMassnberOrdner.data = `Massnahmen-Berichte (${massnberVonPop.length})`
  popMassnberOrdner.attr = {
    id: pop.PopId,
    typ: 'popOrdnerMassnber'
  }
  popMassnberOrdner.children = []

  // massnber aufbauen
  massnberVonPop.forEach(massnber => {
    const popMassnberNode = erstellePopMassnBer(massnber)
    popMassnberOrdner.children.push(popMassnberNode)
  })

  return popMassnberOrdner
}
