'use strict'

const erstelleTPopBer = require(`./tpopBer.js`)

module.exports = (tpopBerListe, tpop) => {
  // Liste der Berichte dieser tpop erstellen
  const tpopberVonTpop = tpopBerListe.filter(tpopBer => tpopBer.TPopId === tpop.TPopId)

  // tpopOrdnerTpopber aufbauen
  return {
    data: `Teilpopulations-Berichte (${tpopberVonTpop.length})`,
    attr: {
      id: `tpopOrdnerTpopber${tpop.TPopId}`,
      typ: `tpopOrdnerTpopber`
    },
    children: tpopberVonTpop.map(tpopber => erstelleTPopBer(tpopber))
  }
}
