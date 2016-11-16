'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.erfkrit.*,
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.erfkrit
      INNER JOIN
        apflora.ap
        ON apflora.erfkrit."ApArtId" = apflora.ap."ApArtId"
      LEFT JOIN
        apflora.ap_erfkrit_werte
        ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "BeurteilOrd"`
  )
    .then(list =>
      list.map(row => ({
        nodeId: `erfkrit/${row.ErfkritId}`,
        table: `erfkrit`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Erfolgskriterien`, row.ErfkritId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/erfkrit`, `erfkrit/${row.ErfkritId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
