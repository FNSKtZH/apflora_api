'use strict'

const erstelleTPopFreiwKontr = require(`./tpopFreiwkontr`)

module.exports = (tpopFreiwkontrListe, tpop) => {
  // Liste der Freiwkontrollen dieser tpop erstellen
  const freiwkontrVonTpop = tpopFreiwkontrListe.filter(tpopFreiwkontr => tpopFreiwkontr.TPopId === tpop.TPopId)

  // tpopOrdnerFreiwkontr aufbauen
  return {
    data: `Freiwilligen-Kontrollen (${freiwkontrVonTpop.length})`,
    attr: {
      id: `tpopOrdnerFreiwkontr${tpop.TPopId}`,
      typ: `tpopOrdnerFreiwkontr`
    },
    children: freiwkontrVonTpop.map(freiwkontr => erstelleTPopFreiwKontr(freiwkontr))
  }
}
