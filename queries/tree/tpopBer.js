'use strict'

module.exports = (tpopber) => {
  let node = {}

  if (tpopber) {
    let nodeText
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    if (tpopber.TPopBerJahr && tpopber.EntwicklungTxt) {
      nodeText = `${tpopber.TPopBerJahr}: ${tpopber.EntwicklungTxt}`
    } else if (tpopber.TPopBerJahr) {
      nodeText = `${tpopber.TPopBerJahr}: (nicht beurteilt)`
    } else if (tpopber.EntwicklungTxt) {
      nodeText = `(kein Jahr): ${tpopber.EntwicklungTxt}`
    } else {
      nodeText = `(kein Jahr): (keine Beurteilung)`
    }

    // node aufbauen
    node = {
      data: nodeText,
      attr: {
        id: tpopber.TPopBerId,
        typ: `tpopber`
      }
    }
  }

  return node
}
