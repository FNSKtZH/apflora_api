'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzeNrUmFuehrendeNullen = require(`../../src/ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  const popId = id
  let apArtId
  let projId

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
        apflora.tpop."PopId" = ${popId}
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
    apArtId = tpopListe[0].ApArtId
    projId = tpopListe[0].ProjId
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

    // build popber
    const popberListe = yield app.db.any(`
      SELECT
        "PopBerId",
        apflora.popber."PopId",
        "PopBerJahr",
        "EntwicklungTxt",
        "EntwicklungOrd",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.popber
        LEFT JOIN
          apflora.pop_entwicklung_werte
          ON "PopBerEntwicklung" = "EntwicklungId"
        INNER JOIN
          apflora.pop
          ON apflora.popber."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.popber."PopId" = ${id}
      ORDER BY
        "PopBerJahr",
        "EntwicklungOrd"`
    )
    const popberFolderChildren = popberListe.map(popber => ({
      nodeId: `popber/${popber.PopBerId}`,
      table: `popber`,
      id: popber.PopBerId,
      name: `${popber.ZielJahr ? `${popber.ZielJahr}` : `(kein Jahr)`}: ${popber.ZielBezeichnung} (${popber.ZieltypTxt})`,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: popber.ProjId },
        { table: `ap`, id: popber.ApArtId },
        { table: `pop`, id: popber.PopId },
        { table: `pop`, id: popber.PopId, folder: `popber` },
        { table: `popber`, id: popber.PopBerId }
      ],
    }))

    // build erfkrit
    const popmassnberListe = yield app.db.any(`
      SELECT
        "PopMassnBerId",
        "PopId",
        "PopMassnBerJahr",
        "BeurteilTxt",
        "BeurteilOrd"
      FROM
        apflora.popmassnber
        LEFT JOIN
          apflora.tpopmassn_erfbeurt_werte
          ON "PopMassnBerErfolgsbeurteilung" = "BeurteilId"
      WHERE
        "PopId" = ${id}
      ORDER BY
        "PopMassnBerJahr",
        "BeurteilOrd"`
    )
    const popmassnberFolderChildren = popmassnberListe.map(erfkrit => ({
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
        nodeId: `pop/${id}/tpop`,
        folder: `tpop`,
        table: `pop`,
        id,
        name: `Teilpopulationen (${tpopListe.length})`,
        expanded: false,
        children: tpopFolderChildren,
      },
      // popber folder
      {
        nodeId: `pop/${id}/popber`,
        folder: `popber`,
        table: `pop`,
        id,
        name: `Kontroll-Berichte (${popberListe.length})`,
        expanded: false,
        children: popberFolderChildren,
      },
      // popmassnber folder
      {
        nodeId: `pop/${id}/popmassnber`,
        folder: `popmassnber`,
        table: `pop`,
        id,
        name: `Massnahmen-Berichte (${popmassnberListe.length})`,
        expanded: false,
        children: popmassnberFolderChildren,
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
