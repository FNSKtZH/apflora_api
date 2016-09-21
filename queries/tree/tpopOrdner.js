'use strict'

const erstelleTpop = require(`./tpop`)

module.exports = (results, tpopListe, pop) => {
  // Liste der tpop dieser pop erstellen
  const tpopVonPop = tpopListe.filter(tpop => tpop.PopId === pop.PopId)

  // tpopOrdnerTpop aufbauen
  return {
    data: `Teilpopulationen (${tpopVonPop.length})`,
    attr: {
      id: pop.PopId,
      typ: `popOrdnerTpop`
    },
    children: tpopVonPop.map(tpop => erstelleTpop(results, tpop))
  }
}
