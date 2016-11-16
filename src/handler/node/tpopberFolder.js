'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.tpopber.*,
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
    .then(liste =>
      liste.map(row => ({
        nodeId: `tpopber/${row.TPopBerId}`,
        table: `tpopber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, id, `Kontroll-Berichte`, row.TPopBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${id}/tpopber`, `tpopber/${row.TPopBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
