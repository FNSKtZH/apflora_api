'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build tpop
  app.db.task(function* getData() {
    const tpopmassnListe = yield app.db.any(`
      SELECT
        "TPopMassnId",
        apflora.tpopmassn."TPopId",
        "TPopMassnJahr",
        "TPopMassnDatum",
        "MassnTypTxt",
        apflora.pop."PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.tpopmassn
        LEFT JOIN
          apflora.tpopmassn_typ_werte
          ON "TPopMassnTyp" = "MassnTypCode"
        INNER JOIN
          apflora.tpop
          ON apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
          INNER JOIN
            apflora.pop
            ON apflora.tpop."PopId" = apflora.pop."PopId"
            INNER JOIN
              apflora.ap
              ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.tpopmassn."TPopId" = ${id}
      ORDER BY
        "TPopMassnJahr",
        "TPopMassnDatum",
        "MassnTypTxt"`
    )
    const tpopmassnFolderChildren = tpopmassnListe.map(tpopmassn => ({
      nodeId: `tpopmassn/${tpopmassn.TPopId}`,
      table: `tpopmassn`,
      id: tpopmassn.TPopId,
      name: `${tpopmassn.TPopMassnJahr ? tpopmassn.TPopMassnJahr : `(kein Jahr)`}/${tpopmassn.MassnTypTxt ? tpopmassn.MassnTypTxt : `(kein Typ)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopmassn.ProjId },
        { table: `ap`, id: tpopmassn.ApArtId },
        { table: `pop`, id: tpopmassn.PopId },
        { table: `tpop`, id: tpopmassn.TPopId },
        { table: `tpopmassn`, id: tpopmassn.TPopMassnId }
      ],
    }))

    // build tpopmassnber
    const tpopmassnberListe = yield app.db.any(`
      SELECT
        "TPopMassnBerId",
        apflora.tpopmassnber."TPopId",
        "TPopMassnBerJahr",
        "BeurteilTxt",
        apflora.pop."PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.tpopmassnber
        LEFT JOIN
          apflora.tpopmassn_erfbeurt_werte
          ON "TPopMassnBerErfolgsbeurteilung" = "BeurteilId"
        INNER JOIN
          apflora.tpop
          ON apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId"
          INNER JOIN
            apflora.pop
            ON apflora.tpop."PopId" = apflora.pop."PopId"
            INNER JOIN
              apflora.ap
              ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.tpopmassnber."TPopId" = ${id}
      ORDER BY
        "TPopMassnBerJahr",
        "BeurteilTxt"`
    )
    const tpopmassnberFolderChildren = tpopmassnberListe.map(tpopmassnber => ({
      nodeId: `tpopmassnber/${tpopmassnber.TPopMassnBerId}`,
      table: `tpopmassnber`,
      id: tpopmassnber.TPopMassnBerId,
      name: `${tpopmassnber.TPopMassnBerJahr ? tpopmassnber.TPopMassnBerJahr : `(kein Jahr)`}/${tpopmassnber.BeurteilTxt ? tpopmassnber.BeurteilTxt : `(keine Beurteilung)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopmassnber.ProjId },
        { table: `ap`, id: tpopmassnber.ApArtId },
        { table: `pop`, id: tpopmassnber.PopId },
        { table: `tpop`, id: tpopmassnber.TPopId },
        { table: `tpopmassnber`, id: tpopmassnber.TPopMassnId }
      ],
    }))

    return [
      // tpopmassn folder
      {
        nodeId: `tpopmassn/${id}/tpopmassn`,
        folder: `tpopmassn`,
        table: `tpop`,
        id,
        name: `Massnahmen (${tpopmassnListe.length})`,
        expanded: false,
        children: tpopmassnFolderChildren,
      },
      // tpopmassnber folder
      {
        nodeId: `tpopmassnber/${id}/tpopmassnber`,
        folder: `tpopmassnber`,
        table: `tpop`,
        id,
        name: `Massnahmen-Berichte (${tpopmassnberListe.length})`,
        expanded: false,
        children: tpopmassnberFolderChildren,
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
