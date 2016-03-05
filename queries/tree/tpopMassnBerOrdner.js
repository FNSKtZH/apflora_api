'use strict'

const erstelleTPopMassnBer = require('./tpopMassnBer')

module.exports = (tpopMassnBerListe, tpop) => {
  // Liste der Massnahmen-Berichte dieser tpop erstellen
  const massnberVonTpop = tpopMassnBerListe.filter((tpopMassnBer) => tpopMassnBer.TPopId === tpop.TPopId)

  // tpopOrdnerMassnahmenBer aufbauen
  return {
    data: `Massnahmen-Berichte (${massnberVonTpop.length})`,
    attr: {
      id: 'tpopOrdnerMassnber' + tpop.TPopId,
      typ: 'tpopOrdnerMassnber'
    },
    children: massnberVonTpop.map((massnber) => erstelleTPopMassnBer(massnber))
  }
}
