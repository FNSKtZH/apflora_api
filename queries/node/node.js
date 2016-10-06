'use strict'

const projekt = require(`./projekt`)
const ap = require(`./ap`)
const apFolder = require(`./apFolder`)
const apberuebersichtFolder = require(`./apberuebersichtFolder`)
const pop = require(`./pop`)
const tpop = require(`./tpop`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  const folder = encodeURIComponent(request.query.folder)
  const folderExists = folder !== `null` && folder !== `undefined`

  if (folderExists) {
    const callHandler = {
      ap() { apFolder(request, callback) },
      apberuebersicht() { apberuebersichtFolder(request, callback) },
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
