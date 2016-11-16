'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      beob.beob_bereitgestellt.*,
      beob.beob_quelle.name AS "Quelle",
      apflora.ap."ProjId",
      apflora.ap."ApArtId",
      beob.beob_bereitgestellt."NO_ISFS"
    FROM
      beob.beob_bereitgestellt
      INNER JOIN
        apflora.ap
        ON beob.beob_bereitgestellt."NO_ISFS" = apflora.ap."ApArtId"
      LEFT JOIN
        beob.beob_quelle
        ON beob.beob_quelle.id = beob.beob_bereitgestellt."QuelleId"
    WHERE
      beob.beob_bereitgestellt."NO_ISFS" = ${id}
    ORDER BY
      beob.beob_bereitgestellt."Datum" DESC
    LIMIT 100`
  )
    .then(apListe =>
      apListe.map(row => ({
        nodeId: `beobNichtBeurteilt/${row.BeobId}`,
        table: `beob_bereitgestellt`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `nicht-beurteilte-Beobachtungen`, row.BeobId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/beobNichtBeurteilt`, `beobNichtBeurteilt/${row.BeobId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
