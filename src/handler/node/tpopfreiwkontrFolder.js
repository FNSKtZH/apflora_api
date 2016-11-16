'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
     apflora.tpopkontr.*,
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
      liste.map(row => ({
        nodeId: `tpopkontr/${row.TPopKontrId}`,
        table: `tpopkontr`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, id, `Freiwilligen-Kontrollen`, row.TPopKontrId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${row.TPopId}/tpopkontr`, `tpopkontr/${row.TPopKontrId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
