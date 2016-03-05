// Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden

'use strict'

module.exports = (popber) => {
  let node = {}
  if (popber) {
    const popberjahrText = popber.PopBerJahr || '(kein Jahr)'
    const entwicklungText = popber.EntwicklungTxt || '(nicht beurteilt)'
    const nodeText = `${popberjahrText}: ${entwicklungText}`

    // node aufbauen
    node = {
      data: nodeText,
      attr: {
        id: popber.PopBerId,
        typ: 'popber'
      }
    }
  }

  return node
}
