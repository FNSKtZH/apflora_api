'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  let projId
  let apArtId
  let popId

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
      nodeId: `tpopmassn/${tpopmassn.TPopMassnId}`,
      table: `tpopmassn`,
      id: tpopmassn.TPopMassnId,
      name: `${tpopmassn.TPopMassnJahr ? tpopmassn.TPopMassnJahr : `(kein Jahr)`}: ${tpopmassn.MassnTypTxt ? tpopmassn.MassnTypTxt : `(kein Typ)`}`,
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
      name: `${tpopmassnber.TPopMassnBerJahr ? tpopmassnber.TPopMassnBerJahr : `(kein Jahr)`}: ${tpopmassnber.BeurteilTxt ? tpopmassnber.BeurteilTxt : `(keine Beurteilung)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopmassnber.ProjId },
        { table: `ap`, id: tpopmassnber.ApArtId },
        { table: `pop`, id: tpopmassnber.PopId },
        { table: `tpop`, id: tpopmassnber.TPopId },
        { table: `tpopmassnber`, id: tpopmassnber.TPopMassnId }
      ],
    }))

    // build tpopfeldkontr
    const tpopfeldkontrListe = yield app.db.any(`
      SELECT
       "TPopKontrId",
       apflora.tpopkontr."TPopId",
       "TPopKontrJahr",
       "TPopKontrTyp",
       apflora.pop."PopId",
       apflora.ap."ApArtId",
       apflora.ap."ProjId"
      FROM
        apflora.tpopkontr
      INNER JOIN
        apflora.tpop
        ON apflora.tpopkontr."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
       apflora.tpopkontr."TPopId" = ${id}
        AND (
         "TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
         OR "TPopKontrTyp" IS NULL
        )
      ORDER BY
        "TPopKontrJahr",
        "TPopKontrTyp"`
    )
    // get projId, apArtId and popId
    // need them to build paths for folders
    if (tpopfeldkontrListe.length > 0) {
      projId = tpopfeldkontrListe[0].ProjId
      apArtId = tpopfeldkontrListe[0].ApArtId
      popId = tpopfeldkontrListe[0].PopId
    } else {
      // need to fetch via pop if no tpop exist yet
      const ap = yield app.db.oneOrNone(`
        SELECT
          apflora.ap."ProjId",
          apflora.ap."ApArtId"
        FROM
          apflora.ap
          INNER JOIN
            apflora.pop
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
            INNER JOIN
              apflora.tpop
              ON apflora.tpop."PopId" = apflora.pop."PopId"
        WHERE
          "TPopId" = ${id}
      `)
      projId = ap.ProjId
      apArtId = ap.ApArtId
      popId = ap.PopId
    }
    const tpopfeldkontrFolderChildren = tpopfeldkontrListe.map(tpopfeldkontr => ({
      nodeId: `tpopfeldkontr/${tpopfeldkontr.TPopKontrId}`,
      table: `tpopfeldkontr`,
      id: tpopfeldkontr.TPopKontrId,
      name: `${tpopfeldkontr.TPopKontrJahr ? tpopfeldkontr.TPopKontrJahr : `(kein Jahr)`}: ${tpopfeldkontr.TPopKontrTyp ? tpopfeldkontr.TPopKontrTyp : `(kein Typ)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopfeldkontr.ProjId },
        { table: `ap`, id: tpopfeldkontr.ApArtId },
        { table: `pop`, id: tpopfeldkontr.PopId },
        { table: `tpop`, id: tpopfeldkontr.TPopId },
        { table: `tpopfeldkontr`, id: tpopfeldkontr.TPopKontrId }
      ],
    }))

    // build tpopfreiwkontr
    const tpopfreiwkontrListe = yield app.db.any(`
      SELECT
       "TPopKontrId",
       apflora.tpopkontr."TPopId",
       "TPopKontrJahr",
       "TPopKontrTyp",
       apflora.pop."PopId",
       apflora.ap."ApArtId",
       apflora.ap."ProjId"
      FROM
        apflora.tpopkontr
      INNER JOIN
        apflora.tpop
        ON apflora.tpopkontr."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
       apflora.tpopkontr."TPopId" = ${id}
       AND "TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
      ORDER BY
        "TPopKontrJahr",
        "TPopKontrTyp"`
    )
    const tpopfreiwkontrFolderChildren = tpopfreiwkontrListe.map(tpopfreiwkontr => ({
      nodeId: `tpopfreiwkontr/${tpopfreiwkontr.TPopKontrId}`,
      table: `tpopfreiwkontr`,
      id: tpopfreiwkontr.TPopKontrId,
      name: `${tpopfreiwkontr.TPopKontrJahr ? tpopfreiwkontr.TPopKontrJahr : `(kein Jahr)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopfreiwkontr.ProjId },
        { table: `ap`, id: tpopfreiwkontr.ApArtId },
        { table: `pop`, id: tpopfreiwkontr.PopId },
        { table: `tpop`, id: tpopfreiwkontr.TPopId },
        { table: `tpopfreiwkontr`, id: tpopfreiwkontr.TPopKontrId }
      ],
    }))

    // build tpopber
    const tpopberListe = yield app.db.any(`
      SELECT
        "TPopBerId",
        apflora.tpopber."TPopId",
        "TPopBerJahr",
        "EntwicklungTxt",
        "EntwicklungOrd",
        apflora.pop."PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.tpopber
        LEFT JOIN
          apflora.tpop_entwicklung_werte
          ON "TPopBerEntwicklung" = "EntwicklungCode"
        INNER JOIN
          apflora.tpop
          ON apflora.tpopber."TPopId" = apflora.tpop."TPopId"
          INNER JOIN
            apflora.pop
            ON apflora.tpop."PopId" = apflora.pop."PopId"
            INNER JOIN
              apflora.ap
              ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.tpopber."TPopId" = ${id}
      ORDER BY
        "TPopBerJahr",
        "EntwicklungOrd"`
    )
    const tpopberFolderChildren = tpopberListe.map(tpopber => ({
      nodeId: `tpopber/${tpopber.TPopBerId}`,
      table: `tpopber`,
      id: tpopber.TPopBerId,
      name: `${tpopber.TPopBerJahr ? tpopber.TPopBerJahr : `(kein Jahr)`}: ${tpopber.EntwicklungTxt ? tpopber.EntwicklungTxt : `(nicht beurteilt)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: tpopber.ProjId },
        { table: `ap`, id: tpopber.ApArtId },
        { table: `pop`, id: tpopber.PopId },
        { table: `tpop`, id: tpopber.TPopId },
        { table: `tpopber`, id: tpopber.TPopBerId }
      ],
    }))

    // build beobzuordnung
    const beobzuordnungListe = yield app.db.any(`
      SELECT
        apflora.beobzuordnung."NO_NOTE",
        apflora.beobzuordnung."TPopId",
        apflora.beobzuordnung."BeobNichtZuordnen",
        apflora.beobzuordnung."BeobBemerkungen",
        apflora.beobzuordnung."BeobMutWann",
        apflora.beobzuordnung."BeobMutWer",
        beob.beob_bereitgestellt."Datum",
        beob.beob_bereitgestellt."Autor",
        'evab' AS "beobtyp",
        apflora.pop."PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.beobzuordnung
        INNER JOIN
          beob.beob_bereitgestellt
          ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
        INNER JOIN
          apflora.tpop
          ON apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId"
          INNER JOIN
            apflora.pop
            ON apflora.tpop."PopId" = apflora.pop."PopId"
            INNER JOIN
              apflora.ap
              ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.beobzuordnung."TPopId" = ${id}
        AND (
          apflora.beobzuordnung."BeobNichtZuordnen" = 0
          OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
        )`
    )
    const beobzuordnungFolderChildren = beobzuordnungListe.map(beobzuordnung => ({
      nodeId: `beobzuordnung/${beobzuordnung.NO_NOTE}`,
      table: `beobzuordnung`,
      id: beobzuordnung.NO_NOTE,
      name: `${beobzuordnung.Datum ? beobzuordnung.Datum : `(kein Datum)`}: ${beobzuordnung.Autor ? beobzuordnung.Autor : `(kein Autor)`}`,
      expanded: false,
      path: [
        { table: `projekt`, id: beobzuordnung.ProjId },
        { table: `ap`, id: beobzuordnung.ApArtId },
        { table: `pop`, id: beobzuordnung.PopId },
        { table: `tpop`, id: beobzuordnung.TPopId },
        { table: `beobzuordnung`, id: beobzuordnung.NO_NOTE }
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
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
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
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
      },
      // tpopfeldkontr folder
      {
        nodeId: `tpopfeldkontr/${id}/tpopfeldkontr`,
        folder: `tpopfeldkontr`,
        table: `tpop`,
        id,
        name: `Feld-Kontrollen (${tpopfeldkontrListe.length})`,
        expanded: false,
        children: tpopfeldkontrFolderChildren,
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
      },
      // tpopfreiwkontr folder
      {
        nodeId: `tpopfreiwkontr/${id}/tpopfreiwkontr`,
        folder: `tpopfreiwkontr`,
        table: `tpop`,
        id,
        name: `Freiwilligen-Kontrollen (${tpopfreiwkontrListe.length})`,
        expanded: false,
        children: tpopfreiwkontrFolderChildren,
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
      },
      // tpopber folder
      {
        nodeId: `tpopber/${id}/tpopber`,
        folder: `tpopber`,
        table: `tpop`,
        id,
        name: `Kontroll-Berichte (${tpopberListe.length})`,
        expanded: false,
        children: tpopberFolderChildren,
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
      },
      // beobzuordnung folder
      {
        nodeId: `beobzuordnung/${id}/beobzuordnung`,
        folder: `beobzuordnung`,
        table: `tpop`,
        id,
        name: `zugeordnete Beobachtungen (${beobzuordnungListe.length})`,
        expanded: false,
        children: beobzuordnungFolderChildren,
        path: [
          { table: `projekt`, id: projId },
          { table: `ap`, id: apArtId },
          { table: `pop`, id: popId },
          { table: `tpop`, id },
        ],
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
