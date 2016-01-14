'use strict'

const erstelleTpopMassn = require('./tpopMassn')

module.exports = function (tpopMassnListe, tpop) {
  let tpopMassnOrdner = {}

  // Liste der Massnahmen dieser tpop erstellen
  const massnVonTpop = tpopMassnListe.filter(tpopMassn => tpopMassn.TPopId === tpop.TPopId)

  // tpopOrdnerMassnahmen aufbauen
  tpopMassnOrdner.data = `Massnahmen (${massnVonTpop.length})`
  tpopMassnOrdner.attr = {
    id: 'tpopOrdnerMassn' + tpop.TPopId,
    typ: 'tpopOrdnerMassn'
  }
  tpopMassnOrdner.children = []

  // massn aufbauen
  massnVonTpop.forEach(massn => {
    const tpopMassnNode = erstelleTpopMassn(massn)
    tpopMassnOrdner.children.push(tpopMassnNode)
  })

  return tpopMassnOrdner
}
