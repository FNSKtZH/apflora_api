'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzeNrUmFuehrendeNullen = require(`../../src/ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  let projId
  let apArtId

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
    // get projId and apArtId
    // need them to build paths for folders
    if (tpopListe.length > 0) {
      projId = tpopListe[0].ProjId
      apArtId = tpopListe[0].ApArtId
    } else {
      // need to fetch via pop if no tpop exist yet
      const ap = yield app.db.oneOrNone(`
        SELECT
          apflora.ap."ProjId"
          apflora.ap."ApArtId"
        FROM
          apflora.ap
          INNER JOIN
            apflora.pop
            ON apflora.pop."ApArtId" = apflora.ap."apArtId"
        WHERE
          "PopId" = ${id}
      `)
      projId = ap.ProjId
      apArtId = ap.ApArtId
    }
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
      name: `${tpop.TPopNr ? tpop.TPopNr : `(keine Nr)`}: ${tpop.TPopFlurname ? tpop.TPopFlurname : `(kein Flurname)`}`,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: tpop.ProjId },
        { table: `ap`, id: tpop.ApArtId },
        { table: `pop`, id: tpop.PopId },
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
      name: `${popber.PopBerJahr ? `${popber.PopBerJahr}` : `(kein Jahr)`}: ${popber.EntwicklungTxt ? popber.EntwicklungTxt : `(nicht beurteilt)`}`,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: popber.ProjId },
        { table: `ap`, id: popber.ApArtId },
        { table: `pop`, id: popber.PopId },
        { table: `popber`, id: popber.PopBerId }
      ],
    }))

    // build popmassnber
    const popmassnberListe = yield app.db.any(`
      SELECT
        "PopMassnBerId",
        apflora.popmassnber."PopId",
        "PopMassnBerJahr",
        "BeurteilTxt",
        "BeurteilOrd",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.popmassnber
        LEFT JOIN
          apflora.tpopmassn_erfbeurt_werte
          ON "PopMassnBerErfolgsbeurteilung" = "BeurteilId"
        INNER JOIN
          apflora.pop
          ON apflora.popmassnber."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.popmassnber."PopId" = ${id}
      ORDER BY
        "PopMassnBerJahr",
        "BeurteilOrd"`
    )
    const popmassnberFolderChildren = popmassnberListe.map(pmb => ({
      nodeId: `popmassnber/${pmb.ErfkritId}`,
      table: `popmassnber`,
      id: pmb.ErfkritId,
      name: `${pmb.PopMassnBerJahr ? `${pmb.PopMassnBerJahr}` : `(kein Jahr)`}: ${pmb.BeurteilTxt ? `${pmb.BeurteilTxt}` : `(nicht beurteilt)`}`,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: pmb.ProjId },
        { table: `ap`, id: pmb.ApArtId },
        { table: `pop`, id: pmb.PopId },
        { table: `popmassnber`, id: pmb.PopMassnBerId }
      ],
    }))

    return [
      // tpop folder
      {
        nodeId: `pop/${id}/tpop`,
        folder: `tpop`,
        table: `pop`,
        id,
        name: `Teil-Populationen (${tpopListe.length})`,
        expanded: false,
        children: tpopFolderChildren,
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id },
        ],
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
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id },
        ],
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
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id },
        ],
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
