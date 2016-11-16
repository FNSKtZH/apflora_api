'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.ber.*,
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.ber
      INNER JOIN
        apflora.ap
        ON apflora.ber."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "BerJahr" DESC,
      "BerTitel"`
  )
    .then(list =>
      list.map(row => ({
        nodeId: `ber/${row.BerId}`,
        table: `ber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Berichte`, row.BerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/ber`, `ber/${row.BerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
