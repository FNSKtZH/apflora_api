'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.oneOrNone(`
    SELECT
      "TPopId",
      apflora.pop."PopId",
      apflora.ap."ProjId",
      apflora.ap."ApArtId",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpopmassn
        WHERE
          apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
      ) AS "AnzTPopmassn",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpopmassnber
        WHERE
          apflora.tpopmassnber."TPopId" = apflora.tpop."TPopId"
      ) AS "AnzTPopmassnber",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpopkontr
        WHERE
          apflora.tpopkontr."TPopId" = apflora.tpop."TPopId"
          AND (
           "TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
           OR "TPopKontrTyp" IS NULL
          )
      ) AS "AnzTPopfeldkontr",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpopkontr
        WHERE
          apflora.tpopkontr."TPopId" = apflora.tpop."TPopId"
          AND "TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
      ) AS "AnzTPopfreiwkontr",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpopber
        WHERE
          apflora.tpopber."TPopId" = apflora.tpop."TPopId"
      ) AS "AnzTPopber",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.beobzuordnung
        WHERE
          apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId"
      ) AS "AnzTPopbeobzuordnung"
    FROM
      apflora.tpop
      INNER JOIN
        apflora.pop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
        INNER JOIN
          apflora.ap
          ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
    WHERE
      apflora.tpop."TPopId" = ${id}
    `
  )
  .then(tpop => [
    // tpopmassn folder
    {
      nodeId: `tpop/${id}/tpopmassn`,
      folder: `tpopmassn`,
      table: `tpop`,
      id,
      name: `Massnahmen (${tpop.AnzTPopmassn})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `Massnahmen`],
    },
    // tpopmassnber folder
    {
      nodeId: `tpop/${id}/tpopmassnber`,
      folder: `tpopmassnber`,
      table: `tpop`,
      id,
      name: `Massnahmen-Berichte (${tpop.AnzTPopmassnber})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `Massnahmen-Berichte`],
    },
    // tpopfeldkontr folder
    {
      nodeId: `tpop/${id}/tpopfeldkontr`,
      folder: `tpopfeldkontr`,
      table: `tpop`,
      id,
      name: `Feld-Kontrollen (${tpop.AnzTPopfeldkontr})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `Feld-Kontrollen`],
    },
    // tpopfreiwkontr folder
    {
      nodeId: `tpop/${id}/tpopfreiwkontr`,
      folder: `tpopfreiwkontr`,
      table: `tpop`,
      id,
      name: `Freiwilligen-Kontrollen (${tpop.AnzTPopfreiwkontr})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `Freiwilligen-Kontrollen`],
    },
    // tpopber folder
    {
      nodeId: `tpop/${id}/tpopber`,
      folder: `tpopber`,
      table: `tpop`,
      id,
      name: `Kontroll-Berichte (${tpop.AnzTPopber})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `Kontroll-Berichte`],
    },
    // beobzuordnung folder
    {
      nodeId: `tpop/${id}/beobzuordnung`,
      folder: `beobzuordnung`,
      table: `tpop`,
      id,
      name: `zugeordnete Beobachtungen (${tpop.AnzTPopbeobzuordnung})`,
      expanded: false,
      children: [0],
      path: [`Projekte`, tpop.ProjId, `Arten`, tpop.ApArtId, `Populationen`, tpop.PopId, `Teil-Populationen`, tpop.TPopId, `zugeordnete-Beobachtungen`],
    },
  ])
  .then(nodes => callback(null, nodes))
  .catch(error => callback(error, null))
}
