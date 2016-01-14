'use strict'

const erstelleTPopMassnBer = require('./tpopMassnBer')

module.exports = function (tpopMassnBerListe, tpop) {
  let tpopMassnBerOrdner = {}

  // Liste der Massnahmen-Berichte dieser tpop erstellen
  const massnberVonTpop = tpopMassnBerListe.filter(tpopMassnBer => tpopMassnBer.TPopId === tpop.TPopId)

  // tpopOrdnerMassnahmenBer aufbauen
  tpopMassnBerOrdner.data = `Massnahmen-Berichte (${massnberVonTpop.length})`
  tpopMassnBerOrdner.attr = {
    id: 'tpopOrdnerMassnber' + tpop.TPopId,
    typ: 'tpopOrdnerMassnber'
  }
  tpopMassnBerOrdner.children = []

  // massnber aufbauen
  massnberVonTpop.forEach(massnber => {
    const massnberNode = erstelleTPopMassnBer(massnber)
    tpopMassnBerOrdner.children.push(massnberNode)
  })

  return tpopMassnBerOrdner
}
