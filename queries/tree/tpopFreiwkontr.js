'use strict'

module.exports = function (freiwkontr) {
  var node = {}
  var nodeText

  if (freiwkontr) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    if (freiwkontr.TPopKontrJahr && freiwkontr.TPopKontrJahr >= 0) {
      nodeText = freiwkontr.TPopKontrJahr.toString()
    } else {
      nodeText = '(kein Jahr)'
    }

    // node aufbauen
    node.data = nodeText
    node.attr = {
      id: 'tpopfreiwkontr' + freiwkontr.TPopKontrId,
      typ: 'tpopfreiwkontr'
    }
  }

  return node
}
