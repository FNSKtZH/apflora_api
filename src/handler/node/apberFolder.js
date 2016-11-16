'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.ap.*
    FROM
      apflora.apber
      INNER JOIN
        apflora.ap
        ON apflora.apber."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "JBerJahr"`
  )
    .then(list =>
      list.map(row => ({
        nodeId: `apber/${row.JBerId}`,
        table: `apber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Berichte`, row.JBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/apber`, `apber/${row.JBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
