'use strict'

var returnFunction = function (feldkontr) {
  var node = {},
    nodeText1,
    nodeText2

  if (feldkontr) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    if (feldkontr.TPopKontrJahr && feldkontr.TPopKontrJahr >= 0) {
      nodeText1 = feldkontr.TPopKontrJahr.toString()
    } else {
      nodeText1 = '(kein Jahr)'
    }

    if (feldkontr.TPopKontrTyp) {
      nodeText2 = feldkontr.TPopKontrTyp
    } else {
      nodeText2 = '(kein Typ)'
    }

    // node aufbauen
    node.data = nodeText1 + ': ' + nodeText2
    node.attr = {
      id: feldkontr.TPopKontrId,
      typ: 'tpopfeldkontr'
    }
  }

  return node
}

module.exports = returnFunction
