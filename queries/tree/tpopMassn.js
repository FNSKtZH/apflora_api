'use strict'

module.exports = (tpopMassn) => {
  let node = {}

  if (tpopMassn) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    const nodeText1 = tpopMassn.TPopMassnJahr || '(kein Jahr)'
    const nodeText2 = tpopMassn.MassnTypTxt || '(kein Typ)'

    // node aufbauen
    node = {
      data: `${nodeText1}: ${nodeText2}`,
      attr: {
        id: tpopMassn.TPopMassnId,
        typ: 'tpopmassn'
      }
    }
  }

  return node
}
