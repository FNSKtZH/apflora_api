'use strict'

module.exports = (tpopbeob) => {
  let node = {}

  if (tpopbeob) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    const autor = tpopbeob.Autor && tpopbeob.Autor !== ` ` ? tpopbeob.Autor : `(kein Autor)`
    const datum = tpopbeob.Datum ? tpopbeob.Datum : `(kein Datum)`

    // node aufbauen
    node = {
      data: `${datum}: ${autor}`,
      attr: {
        id: `beob${tpopbeob.NO_NOTE}`,
        typ: `beobZugeordnet`,
        beobtyp: tpopbeob.beobtyp
      }
    }
  }
  return node
}
