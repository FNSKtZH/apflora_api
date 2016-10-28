'use strict'

const erstellePopMassnBer = require(`./popMassnBer`)

module.exports = (popMassnBerListe, pop) => {
  // Liste der MassnBer dieser pop erstellen
  const massnberVonPop = popMassnBerListe.filter(popMassnBer => popMassnBer.PopId === pop.PopId)

  // tpopOrdnerTpopber aufbauen
  const popMassnberOrdner = {
    data: `Massnahmen-Berichte (${massnberVonPop.length})`,
    attr: {
      id: pop.PopId,
      typ: `popOrdnerMassnber`
    },
    children: massnberVonPop.map(massnber => erstellePopMassnBer(massnber))
  }

  return popMassnberOrdner
}
