'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
     apflora.tpopkontrzaehl.*,
     apflora.tpopkontr."TPopKontrId",
     apflora.tpop."TPopId",
     apflora.pop."PopId",
     apflora.ap."ApArtId",
     apflora.ap."ProjId"
    FROM
      apflora.tpopkontrzaehl
      INNER JOIN
        apflora.tpopkontr
        ON apflora.tpopkontr."TPopKontrId" = apflora.tpopkontrzaehl."TPopKontrId"
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
     apflora.tpopkontrzaehl."TPopKontrId" = ${id}
    ORDER BY
      "TPopKontrZaehlId"`
  )
    .then(liste =>
      liste.map(row => ({
        nodeId: `tpopkontrzaehl/${row.TPopKontrZaehlId}`,
        table: `tpopkontrzaehl`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, row.TPopId, `Feld-Kontrollen`, id, `Zählungen`, row.TPopKontrZaehlId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${row.TPopId}/tpopkontr`, `tpopkontr/${row.TPopKontrId}`, `tpopkontr/${row.TPopKontrId}/tpopkontrzaehl`, `tpopkontrzaehl/${row.TPopKontrZaehlId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
