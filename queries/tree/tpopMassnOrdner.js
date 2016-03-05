'use strict'

const erstelleTpopMassn = require('./tpopMassn')

module.exports = (tpopMassnListe, tpop) => {
  // Liste der Massnahmen dieser tpop erstellen
  const massnVonTpop = tpopMassnListe.filter((tpopMassn) => tpopMassn.TPopId === tpop.TPopId)

  // tpopOrdnerMassnahmen aufbauen
  return {
    data: `Massnahmen (${massnVonTpop.length})`,
    attr: {
      id: 'tpopOrdnerMassn' + tpop.TPopId,
      typ: 'tpopOrdnerMassn'
    },
    children: massnVonTpop.map((massn) => erstelleTpopMassn(massn))
  }
}
