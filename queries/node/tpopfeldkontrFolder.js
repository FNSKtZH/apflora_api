'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
     "TPopKontrId",
     apflora.tpopkontr."TPopId",
     "TPopKontrJahr",
     "TPopKontrTyp",
     apflora.pop."PopId",
     apflora.ap."ApArtId",
     apflora.ap."ProjId",
     (
       SELECT
        COUNT(*)
       FROM
        apflora.tpopkontrzaehl
       WHERE
        apflora.tpopkontrzaehl."TPopKontrId" = apflora.tpopkontr."TPopKontrId"
     ) AS "AnzTPopkontrzaehl"
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
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopkontr/${el.TPopKontrId}`,
        table: `tpopkontr`,
        id: el.TPopKontrId,
        name: `${el.TPopKontrJahr ? el.TPopKontrJahr : `(kein Jahr)`}: ${el.TPopKontrTyp ? el.TPopKontrTyp : `(kein Typ)`}`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Feld-Kontrollen`, el.TPopKontrId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${id}/tpopkontr`, `tpopkontr/${el.TPopKontrId}`],
        children: [{
          nodeId: `tpopkontr/${el.TPopKontrId}/tpopkontrzaehl`,
          folder: `tpopkontrzaehl`,
          table: `tpopkontr`,
          id: el.TPopKontrId,
          name: `Zählungen (${el.AnzTPopkontrzaehl})`,
          expanded: false,
          urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Feld-Kontrollen`, el.TPopKontrId, `Zählungen`],
          nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${id}/tpopkontr`, `tpopkontr/${el.TPopKontrId}`, `tpopkontr/${el.TPopKontrId}/tpopkontrzaehl`],
          children: [0],
        }]
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
