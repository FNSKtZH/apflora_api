'use strict'

var returnFunction = function (tpopbeob) {
  var node = {}
  var autor
  var datum

  if (tpopbeob) {
    // Baum-node sinnvoll beschreiben, auch wenn leere Werte vorhanden
    if (tpopbeob.Autor && tpopbeob.Autor !== ' ') {
      autor = tpopbeob.Autor
    } else {
      autor = '(kein Autor)'
    }

    if (tpopbeob.Datum) {
      datum = tpopbeob.Datum
    } else {
      datum = '(kein Datum)'
    }

    // node aufbauen
    node.data = datum + ': ' + autor
    node.attr = {
      id: 'beob' + tpopbeob.NO_NOTE,
      typ: 'beobZugeordnet',
      beobtyp: tpopbeob.beobtyp
    }
  }
  return node
}

module.exports = returnFunction
