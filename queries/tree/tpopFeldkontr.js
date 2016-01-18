'use strict'

module.exports = (feldkontr) => {
  let node = {}

  if (feldkontr) {
    const tPopKontrJahr = feldkontr.TPopKontrJahr
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    const nodeText1 = tPopKontrJahr && tPopKontrJahr >= 0 ? tPopKontrJahr.toString() : '(kein Jahr)'
    const nodeText2 = feldkontr.TPopKontrTyp ? feldkontr.TPopKontrTyp : '(kein Typ)'

    // node aufbauen
    node = {
      data: `${nodeText1}: ${nodeText2}`,
      attr: {
        id: feldkontr.TPopKontrId,
        typ: 'tpopfeldkontr'
      }
    }
  }

  return node
}
