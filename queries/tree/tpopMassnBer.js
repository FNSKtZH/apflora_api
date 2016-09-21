'use strict'

module.exports = (tpopMassnber) => {
  let node = {}

  if (tpopMassnber) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    const nodeText1 = tpopMassnber.TPopMassnBerJahr || `(kein Jahr)`
    const nodeText2 = tpopMassnber.BeurteilTxt || `(keine Beurteilung)`

    // node aufbauen
    node = {
      data: `${nodeText1}: ${nodeText2}`,
      attr: {
        id: tpopMassnber.TPopMassnBerId,
        typ: `tpopmassnber`
      }
    }
  }

  return node
}
