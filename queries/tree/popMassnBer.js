// Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden

'use strict'

module.exports = (massnber) => {
  let node = {}

  if (massnber) {
    const massnberText = massnber.PopMassnBerJahr || '(kein Jahr)'
    const beurteilText = massnber.BeurteilTxt || '(nicht beurteilt)'
    const nodeText = `${massnberText}: ${beurteilText}`
    // node aufbauen
    const data = nodeText
    const attr = {
      id: massnber.PopMassnBerId,
      typ: 'popmassnber'
    }
    node = { data, attr }
  }

  return node
}
