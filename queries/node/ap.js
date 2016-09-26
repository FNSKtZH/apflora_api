'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzePopNrUmFuehrendeNullen = require(`../../src/ergaenzePopNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
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
    const popFolderChildren = popListe.map(pop => ({
      nodeId: `pop/${pop.PopId}`,
      type: `dataset`,
      table: `pop`,
      id: pop.PopId,
      name: pop.name,
      expanded: false,
      children: [0],
    }))

    // build apziel
    const zielListe = yield app.db.any(`
      SELECT
        apflora.ziel."ApArtId",
        apflora.ziel."ZielId",
        apflora.ziel_typ_werte."ZieltypTxt",
        apflora.ziel."ZielJahr",
        apflora.ziel."ZielBezeichnung"
      FROM
        apflora.ziel
        LEFT JOIN apflora.ziel_typ_werte
        ON apflora.ziel."ZielTyp" = apflora.ziel_typ_werte."ZieltypId"
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        apflora.ziel."ZielJahr" DESC,
        "ZielBezeichnung"`
    )
    const zielFolderChildren = zielListe.map(ziel => ({
      nodeId: `ziel/${ziel.ZielId}`,
      type: `folder`,
      table: `ziel`,
      id: ziel.ZielId,
      name: `${ziel.ZielJahr ? `${ziel.ZielJahr}` : `(kein Jahr)`}: ${ziel.ZielBezeichnung} (${ziel.ZieltypTxt})`,
      expanded: false,
      children: [0],
    }))

    // build erfkrit
    const erfkritListe = yield app.db.any(`
      SELECT
        "ErfkritId",
        "ApArtId",
        "BeurteilTxt",
        "ErfkritTxt",
        "BeurteilOrd"
      FROM
        apflora.erfkrit
        LEFT JOIN
          apflora.ap_erfkrit_werte
          ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "BeurteilOrd"`
    )
    const erfkritFolderChildren = erfkritListe.map(erfkrit => ({
      nodeId: `erfkrit/${erfkrit.ErfkritId}`,
      type: `folder`,
      table: `erfkrit`,
      id: erfkrit.ErfkritId,
      name: `${erfkrit.BeurteilTxt ? `${erfkrit.BeurteilTxt}` : `(nicht beurteilt)`}: ${erfkrit.ErfkritTxt ? `${erfkrit.ErfkritTxt}` : `(keine Kriterien erfasst)`}`,
      expanded: false,
      children: [0],
    }))

    const berListe = yield app.db.any(`
      SELECT
        "BerId",
        "ApArtId",
        "BerJahr",
        "BerTitel"
      FROM
        apflora.ber
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "BerJahr" DESC,
        "BerTitel"`
    )

    return [
      // qk folder
      {
        nodeId: `ap/${id}/qk`,
        type: `folder`,
        table: `ap`,
        id,
        name: `Qualitätskontrollen`,
        expanded: false,
        children: [],
      },
      // pop folder
      {
        nodeId: `ap/${id}/pop`,
        type: `folder`,
        table: `ap`,
        id,
        name: `Populationen (${popListe.length})`,
        expanded: false,
        children: popFolderChildren,
      },
      {
        nodeId: `ap/${id}/ziel`,
        type: `folder`,
        table: `ap`,
        id,
        name: `AP-Ziele (${zielListe.length})`,
        expanded: false,
        children: zielFolderChildren,
      },
      {
        nodeId: `ap/${id}/erfkrit`,
        type: `folder`,
        table: `erfkrit`,
        id,
        name: `AP-Erfolgskriterien (${erfkritListe.length})`,
        expanded: false,
        children: erfkritFolderChildren,
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
