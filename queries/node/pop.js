'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzeNrUmFuehrendeNullen = require(`../../src/ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build tpop
  app.db.task(function* getData() {
    let tpopListe = yield app.db.any(`
      SELECT
        "TPopNr",
        "TPopFlurname",
        "TPopId",
        apflora.tpop."PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.tpop
          INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
            INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.tpop."PopId" = ${id}
      ORDER BY
        "TPopNr",
        "TPopFlurname"`
    )
    // TPopNr: Je nach Anzahl Stellen der maximalen TPopNr bei denjenigen mit weniger Nullen
    // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
    const tpopNrMax = _.max(tpopListe, tpop => tpop.TPopNr).TPopNr
    tpopListe.forEach((tpop) => {
      tpop.sort = tpop.TPopNr ? tpop.TPopNr : 1000
      tpop.TPopNr = ergaenzeNrUmFuehrendeNullen(tpopNrMax, tpop.TPopNr)
    })
    tpopListe = _.sortBy(tpopListe, `sort`)
    const tpopFolderChildren = tpopListe.map(tpop => ({
      nodeId: `tpop/${tpop.TPopId}`,
      table: `tpop`,
      id: tpop.TPopId,
      name: `${tpop.TPopNr ? tpop.TPopNr : `(keine Nr)`}/${tpop.TPopFlurname ? tpop.TPopFlurname : `(kein Flurname)`}`,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: tpop.ProjId },
        { table: `ap`, id: tpop.ApArtId },
        { table: `pop`, id: tpop.PopId },
        { table: `pop`, id: tpop.PopId, folder: `tpop` },
        { table: `tpop`, id: tpop.TPopId }
      ],
    }))

    // build apziel
    const zielListe = yield app.db.any(`
      SELECT
        apflora.ziel."ApArtId",
        apflora.ziel."ZielId",
        apflora.ziel_typ_werte."ZieltypTxt",
        apflora.ziel."ZielJahr",
        apflora.ziel."ZielBezeichnung",
        apflora.ap."ProjId"
      FROM
        apflora.ziel
        INNER JOIN
          apflora.ap
          ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
        LEFT JOIN
          apflora.ziel_typ_werte
          ON apflora.ziel."ZielTyp" = apflora.ziel_typ_werte."ZieltypId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        apflora.ziel."ZielJahr" DESC,
        "ZielBezeichnung"`
    )
    const zielFolderChildren = zielListe.map(ziel => ({
      nodeId: `ziel/${ziel.ZielId}`,
      table: `ziel`,
      id: ziel.ZielId,
      name: `${ziel.ZielJahr ? `${ziel.ZielJahr}` : `(kein Jahr)`}: ${ziel.ZielBezeichnung} (${ziel.ZieltypTxt})`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: ziel.ProjId }, { table: `ap`, id: ziel.ApArtId }, { table: `ziel`, id: ziel.ZielId }],
    }))

    // build erfkrit
    const erfkritListe = yield app.db.any(`
      SELECT
        "ErfkritId",
        apflora.ap."ApArtId",
        "BeurteilTxt",
        "ErfkritTxt",
        "BeurteilOrd",
        apflora.ap."ProjId"
      FROM
        apflora.erfkrit
        INNER JOIN
          apflora.ap
          ON apflora.erfkrit."ApArtId" = apflora.ap."ApArtId"
        LEFT JOIN
          apflora.ap_erfkrit_werte
          ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "BeurteilOrd"`
    )
    const erfkritFolderChildren = erfkritListe.map(erfkrit => ({
      nodeId: `erfkrit/${erfkrit.ErfkritId}`,
      table: `erfkrit`,
      id: erfkrit.ErfkritId,
      name: `${erfkrit.BeurteilTxt ? `${erfkrit.BeurteilTxt}` : `(nicht beurteilt)`}: ${erfkrit.ErfkritTxt ? `${erfkrit.ErfkritTxt}` : `(keine Kriterien erfasst)`}`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: erfkrit.ProjId }, { table: `ap`, id: erfkrit.ApArtId }, { table: `erfkrit`, id: erfkrit.ErfkritId }],
    }))

    return [
      // tpop folder
      {
        nodeId: `ap/${id}/qk`,
        folder: `qk`,
        table: `ap`,
        id,
        name: `Qualitätskontrollen`,
        expanded: false,
        children: [],
      },
      // popber folder
      {
        nodeId: `ap/${id}/pop`,
        folder: `pop`,
        table: `ap`,
        id,
        name: `Populationen (${popListe.length})`,
        expanded: false,
        children: popFolderChildren,
      },
      // popmassnber folder
      {
        nodeId: `ap/${id}/ziel`,
        folder: `ziel`,
        table: `ap`,
        id,
        name: `AP-Ziele (${zielListe.length})`,
        expanded: false,
        children: zielFolderChildren,
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
