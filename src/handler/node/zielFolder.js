'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.ziel.*,
      apflora.ap."ProjId",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.zielber
        WHERE
          apflora.zielber."ZielId" = apflora.ziel."ZielId"
      ) AS "AnzZielber"
    FROM
      apflora.ziel
      INNER JOIN
        apflora.ap
        ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      apflora.ziel."ZielJahr" DESC,
      "ZielBezeichnung"`
  )
    .then(list =>
      list.map(row => ({
        nodeId: `ziel/${row.ZielId}`,
        table: `ziel`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, id, `AP-Ziele`, row.ZielId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/ziel`, `ziel/${row.ZielId}`],
        children: [{
          nodeId: `ziel/${row.ZielId}/zielber`,
          folder: `zielber`,
          table: `ziel`,
          row,
          id: row.ProjId,
          expanded: false,
          children: _.times(row.AnzZielber, _.constant(0)),
          urlPath: [`Projekte`, row.ProjId, `Arten`, id, `AP-Ziele`, row.ZielId, `Berichte`],
          nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/ziel`, `ziel/${row.ZielId}`, `ziel/${row.ZielId}/zielber`],
        }],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
