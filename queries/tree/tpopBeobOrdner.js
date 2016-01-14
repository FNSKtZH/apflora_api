'use strict'

const erstelleTPopBeob = require('./tpopBeob')

module.exports = function (tpopBeobZugeordnetListe, tpop) {
  let tpopTpopBeobOrdner = {}

  // Liste der zugeordneten Beobachtungen dieser tpop erstellen
  const tpopbeobVonTpop = tpopBeobZugeordnetListe.filter(tpopBeob => tpopBeob.TPopId === tpop.TPopId)

  // tpopOrdnerBeobZugeordnet aufbauen
  tpopTpopBeobOrdner.data = `Beobachtungen (${tpopbeobVonTpop.length})`
  tpopTpopBeobOrdner.attr = {
    id: 'tpopOrdnerBeobZugeordnet' + tpop.TPopId,
    typ: 'tpopOrdnerBeobZugeordnet'
  }
  tpopTpopBeobOrdner.children = []

  // tpopBeob aufbauen
  tpopbeobVonTpop.forEach(tpopBeob => {
    const feldkontrNode = erstelleTPopBeob(tpopBeob)
    tpopTpopBeobOrdner.children.push(feldkontrNode)
  })

  return tpopTpopBeobOrdner
}
