'use strict'

module.exports = function (tpopMassnber) {
  var node = {},
    nodeText1,
    nodeText2

  if (tpopMassnber) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    nodeText1 = tpopMassnber.TPopMassnBerJahr || '(kein Jahr)'
    nodeText2 = tpopMassnber.BeurteilTxt || '(keine Beurteilung)'

    // node aufbauen
    node.data = nodeText1 + ': ' + nodeText2
    node.attr = {
      id: tpopMassnber.TPopMassnBerId,
      typ: 'tpopmassnber'
    }
  }

  return node
}
