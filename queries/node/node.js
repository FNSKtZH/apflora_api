'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)
const apFolder = require(`./apFolder`)
const apberFolder = require(`./apberFolder`)
const apberuebersichtFolder = require(`./apberuebersichtFolder`)
const assozartFolder = require(`./assozartFolder`)
const beobNichtBeurteiltFolder = require(`./beobNichtBeurteiltFolder`)
const beobNichtZuzuordnenFolder = require(`./beobNichtZuzuordnenFolder`)
const berFolder = require(`./berFolder`)
const erfkritFolder = require(`./erfkritFolder`)
const pop = require(`./pop`)
const popFolder = require(`./popFolder`)
const tpop = require(`./tpop`)
const zielFolder = require(`./zielFolder`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const folder = encodeURIComponent(request.query.folder)
  const folderExists = folder !== `null` && folder !== `undefined`

  if (folderExists) {
    const callHandler = {
      ap() { apFolder(request, callback) },
      apber() { apberFolder(request, callback) },
      apberuebersicht() { apberuebersichtFolder(request, callback) },
      assozart() { assozartFolder(request, callback) },
      beobNichtBeurteilt() { beobNichtBeurteiltFolder(request, callback) },
      beobNichtZuzuordnen() { beobNichtZuzuordnenFolder(request, callback) },
      ber() { berFolder(request, callback) },
      erfkrit() { erfkritFolder(request, callback) },
      pop() { popFolder(request, callback) },
      ziel() { zielFolder(request, callback) },
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
