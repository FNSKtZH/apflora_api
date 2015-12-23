// Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden

'use strict'

module.exports = function (popber) {
  var node = {}
  var nodeText
  var popberjahrText
  var entwicklungText

  if (popber) {
    popberjahrText = popber.PopBerJahr || '(kein Jahr)'
    entwicklungText = popber.EntwicklungTxt || '(nicht beurteilt)'
    nodeText = popberjahrText + ': ' + entwicklungText

    // node aufbauen
    node.data = nodeText
    node.attr = {
      id: popber.PopBerId,
      typ: 'popber'
    }
  }

  return node
}
