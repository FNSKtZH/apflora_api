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
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopkontr/${el.TPopKontrId}`,
        table: `tpopkontr`,
        row: {
          TPopKontrId: el.TPopKontrId,
          TPopKontrJahr: el.TPopKontrJahr,
          TPopKontrTyp: el.TPopKontrTyp,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Freiwilligen-Kontrollen`, el.TPopKontrId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${el.TPopId}/tpopkontr`, `tpopkontr/${el.TPopKontrId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
