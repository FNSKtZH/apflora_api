// Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden

'use strict'

module.exports = function (massnber) {
  var node = {},
    nodeText,
    massnberText,
    beurteilText

  if (massnber) {
    massnberText = massnber.PopMassnBerJahr || '(kein Jahr)'
    beurteilText = massnber.BeurteilTxt || '(nicht beurteilt)'
    nodeText = massnberText + ': ' + beurteilText

    // node aufbauen
    node.data = nodeText
    node.attr = {
      id: massnber.PopMassnBerId,
      typ: 'popmassnber'
    }
  }

  return node
}
