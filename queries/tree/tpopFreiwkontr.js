'use strict'

module.exports = (freiwkontr) => {
  let node = {}

  if (freiwkontr) {
    const tPopKontrJahr = freiwkontr.TPopKontrJahr
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    const nodeText = tPopKontrJahr && tPopKontrJahr >= 0 ? tPopKontrJahr.toString() : '(kein Jahr)'

    // node aufbauen
    node = {
      data: nodeText,
      attr: {
        id: `tpopfreiwkontr${freiwkontr.TPopKontrId}`,
        typ: 'tpopfreiwkontr'
      }
    }
  }

  return node
}
