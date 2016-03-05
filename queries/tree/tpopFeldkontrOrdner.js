'use strict'

const erstelleTPopFeldKontr = require('./tpopFeldkontr')

module.exports = (tpopFeldkontrListe, tpop) => {
  // Liste der Feldkontrollen dieser tpop erstellen
  const feldkontrVonTpop = tpopFeldkontrListe.filter((tpopFeldkontr) => tpopFeldkontr.TPopId === tpop.TPopId)

  // tpopOrdnerFeldkontr aufbauen
  return {
    data: `Feldkontrollen (${feldkontrVonTpop.length})`,
    attr: {
      id: `tpopOrdnerFeldkontr${tpop.TPopId}`,
      typ: 'tpopOrdnerFeldkontr'
    },
    children: feldkontrVonTpop.map((feldkontr) => erstelleTPopFeldKontr(feldkontr))
  }
}
