'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.popber.*,
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
    .then(apListe =>
      apListe.map(row => ({
        nodeId: `popber/${row.PopBerId}`,
        table: `popber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, id, `Kontroll-Berichte`, row.PopBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popber`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
