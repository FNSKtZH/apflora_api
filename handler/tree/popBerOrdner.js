'use strict'

const erstellePopBer = require(`./popBer`)

module.exports = (popBerListe, pop) => {
  // Liste der Berichte dieser pop erstellen
  const popberVonPop = popBerListe.filter(popBer => popBer.PopId === pop.PopId)
  const data = `Kontroll-Berichte (${popberVonPop.length})`
  const attr = {
    id: pop.PopId,
    typ: `popOrdnerPopber`
  }
  const children = popberVonPop.map(popber => erstellePopBer(popber))
  // tpopOrdnerTpopber aufbauen
  const popPopberOrdner = { data, attr, children }

  return popPopberOrdner
}
