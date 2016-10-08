'use strict'

const erstelleTPopBeob = require(`./tpopBeob`)

module.exports = (tpopBeobZugeordnetListe, tpop) => {
  // Liste der zugeordneten Beobachtungen dieser tpop erstellen
  const tpopbeobVonTpop = tpopBeobZugeordnetListe.filter(tpopBeob => tpopBeob.TPopId === tpop.TPopId)

  return {
    data: `Beobachtungen (${tpopbeobVonTpop.length})`,
    attr: {
      id: `tpopOrdnerBeobZugeordnet${tpop.TPopId}`,
      typ: `tpopOrdnerBeobZugeordnet`
    },
    children: tpopbeobVonTpop.map(tpopBeob => erstelleTPopBeob(tpopBeob))
  }
}
