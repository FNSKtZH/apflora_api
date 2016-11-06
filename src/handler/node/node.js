'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)
const apFolder = require(`./apFolder`)
const apberFolder = require(`./apberFolder`)
const apberuebersichtFolder = require(`./apberuebersichtFolder`)
const assozartFolder = require(`./assozartFolder`)
const beobNichtBeurteiltFolder = require(`./beobNichtBeurteiltFolder`)
const beobNichtZuzuordnenFolder = require(`./beobNichtZuzuordnenFolder`)
const beobzuordnungFolder = require(`./beobzuordnungFolder`)
const berFolder = require(`./berFolder`)
const erfkritFolder = require(`./erfkritFolder`)
const pop = require(`./pop`)
const popFolder = require(`./popFolder`)
const popmassnberFolder = require(`./popmassnberFolder`)
const popberFolder = require(`./popberFolder`)
const tpop = require(`./tpop`)
const tpopFolder = require(`./tpopFolder`)
const tpopberFolder = require(`./tpopberFolder`)
const tpopfreiwkontrFolder = require(`./tpopfreiwkontrFolder`)
const tpopfeldkontrFolder = require(`./tpopfeldkontrFolder`)
const tpopfeldkontrzaehlFolder = require(`./tpopfeldkontrzaehlFolder`)
const tpopmassnberFolder = require(`./tpopmassnberFolder`)
const tpopmassnFolder = require(`./tpopmassnFolder`)
const zielFolder = require(`./zielFolder`)
const zielberFolder = require(`./zielberFolder`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const folder = encodeURIComponent(request.query.folder)
  const folderExists = !!folder && (folder !== `null` && folder !== `undefined`)

  if (folderExists) {
    const callHandler = {
      ap() { apFolder(request, callback) },
      apber() { apberFolder(request, callback) },
      apberuebersicht() { apberuebersichtFolder(request, callback) },
      assozart() { assozartFolder(request, callback) },
      beobNichtBeurteilt() { beobNichtBeurteiltFolder(request, callback) },
      beobNichtZuzuordnen() { beobNichtZuzuordnenFolder(request, callback) },
      beobzuordnung() { beobzuordnungFolder(request, callback) },
      ber() { berFolder(request, callback) },
      erfkrit() { erfkritFolder(request, callback) },
      pop() { popFolder(request, callback) },
      popmassnber() { popmassnberFolder(request, callback) },
      popber() { popberFolder(request, callback) },
      tpop() { tpopFolder(request, callback) },
      tpopber() { tpopberFolder(request, callback) },
      tpopfreiwkontr() { tpopfreiwkontrFolder(request, callback) },
      tpopfeldkontr() { tpopfeldkontrFolder(request, callback) },
      tpopkontrzaehl() { tpopfeldkontrzaehlFolder(request, callback) },
      tpopmassnber() { tpopmassnberFolder(request, callback) },
      tpopmassn() { tpopmassnFolder(request, callback) },
      ziel() { zielFolder(request, callback) },
      zielber() { zielberFolder(request, callback) },
    }
    callHandler[folder]()
  } else {
    const callHandler = {
      projekt() { projekt(request, callback) },
      ap() { ap(request, callback) },
      pop() { pop(request, callback) },
      tpop() { tpop(request, callback) },
    }
    callHandler[table]()
  }
}
