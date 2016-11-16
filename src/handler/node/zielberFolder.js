'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.zielber.*,
      apflora.ap."ProjId",
      apflora.ap."ApArtId"
    FROM
      apflora.zielber
      INNER JOIN
        apflora.ziel
        ON apflora.ziel."ZielId" = apflora.zielber."ZielId"
        INNER JOIN
          apflora.ap
          ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.zielber."ZielId" = ${id}
    ORDER BY
      "ZielBerJahr",
      "ZielBerErreichung"`
  )
    .then(list =>
      list.map(row => ({
        nodeId: `zielber/${row.ZielBerId}`,
        table: `zielber`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Ziele`, id, `Berichte`, row.ZielBerId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/ziel`, `ziel/${row.ZielId}`, `ziel/${row.ZielId}/zielber`, `zielber/${row.ZielBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
