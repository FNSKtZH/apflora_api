'use strict'

const app = require(`ampersand-app`)
const ergaenzePopNrUmFuehrendeNullen = require(`../../src/ergaenzePopNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  const table = encodeURIComponent(request.query.table)
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build pop
  app.db.task(function* getData() {
    const popListe = yield app.db.any(`
      SELECT
        "PopNr",
        "PopName",
        "PopId",
        "ApArtId"
      FROM
        apflora.pop
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "PopNr",
        "PopName"`
    )
    // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
    // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
    const popNrMax = _.maxBy(popListe, pop => pop.PopNr).PopNr

    popListe.forEach((pop) => {
      let name
      let sort

      pop.PopNr = ergaenzePopNrUmFuehrendeNullen(popNrMax, pop.PopNr)

      // nodes für pop aufbauen
      if (pop.PopName && pop.PopNr) {
        pop.name = `${pop.PopNr}: ${pop.PopName}`
        pop.sort = pop.PopNr
      } else if (pop.PopNr) {
        pop.name = `${pop.PopNr}: (kein Name)`
        pop.sort = pop.PopNr
      } else if (pop.PopName) {
        pop.name = `(keine Nr): ${pop.PopName}`
        // pop ohne Nummern zuunterst sortieren
        pop.sort = 1000
      } else {
        pop.name = `(keine Nr, kein Name)`
        pop.sort = 1000
      }
    })

    const popChildren = popListe.map(pop => ({
      nodeId: `pop/${pop.PopId}`,
      type: `dataset`,
      table: `pop`,
      id: pop.PopId,
      name: pop.name,
      sort: pop.sort,
      expanded: false,
      children: [0],
    }))

    // build apziel
    const zielListe = yield app.db.any(`
      SELECT
        "ApArtId",
        "ZielId",
        "ZielTyp",
        "ZielJahr",
        "ZielBezeichnung"
      FROM
        apflora.ziel
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "ZielTyp",
        "ZielBezeichnung"`
    )
    const zielListePerYear = _.chain(zielListe)
      .groupBy('ZielJahr')
      .map((value, key) => ({
        ZielJahr: key,
        anzZiele: _.map(value).length
      }))
      .value()

    const zielChildren = zielListePerYear.map(el => ({
      nodeId: `ziel/${ziel.ApArtId}`,
      type: `folder`,
      table: `ziel`,
      id: ziel.PopId,
      name: ziel.name,
      sort: ziel.ZielJahr || 999999,
      expanded: false,
      children: [0],
    }))

    const zielPerYearChildren = zielListe.map(ziel => ({
      nodeId: `ziel/${ziel.PopId}`,
      type: `dataset`,
      table: `ziel`,
      id: ziel.PopId,
      name: ziel.name,
      sort: ziel.ZielJahr || 999999,
      expanded: false,
      children: [0],
    }))

    return [
      {
        nodeId: `pop/${pop.PopId}/qk`,
        type: 'folder',
        table: 'pop',
        id: pop.PopId,
        name: 'Qualitätskontrollen',
        sort: 0,
        expanded: false,
        children: [],
      },
      {
        nodeId: `pop/${pop.PopId}/pop`,
        type: 'folder',
        table: 'pop',
        id: pop.PopId,
        name: `Populationen (${popListe.length})`,
        sort: 1,
        expanded: false,
        children: popChildren,
      },
      {
        nodeId: `pop/${pop.PopId}/ziel`,
        type: 'folder',
        table: 'pop',
        id: pop.PopId,
        name: `AP-Ziele (${zielListe.length})`,
        sort: 2,
        expanded: false,
        children: zielChildren,
      },

    [
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
