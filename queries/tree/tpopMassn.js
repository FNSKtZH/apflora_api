'use strict'

module.exports = function (tpopMassn) {
  var node = {},
    nodeText1,
    nodeText2

  if (tpopMassn) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    nodeText1 = tpopMassn.TPopMassnJahr || '(kein Jahr)'
    nodeText2 = tpopMassn.MassnTypTxt || '(kein Typ)'

    // node aufbauen
    node.data = nodeText1 + ': ' + nodeText2
    node.attr = {
      id: tpopMassn.TPopMassnId,
      typ: 'tpopmassn'
    }
  }

  return node
}
