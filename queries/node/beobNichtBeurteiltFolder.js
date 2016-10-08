'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      beob.beob_bereitgestellt."BeobId",
      beob.beob_bereitgestellt."QuelleId",
      beob.beob_bereitgestellt."Datum",
      beob.beob_bereitgestellt."Autor",
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
      apListe.map(el => ({
        nodeId: `beobNichtBeurteilt/${el.BeobId}`,
        table: `beob_bereitgestellt`,
        id: el.BeobId,
        name: `${el.Datum ? `${el.Datum}` : `(kein Datum)`}: ${el.Autor ? `${el.Autor}` : `(kein Autor)`} (${el.Quelle})`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `nicht-beurteilte-Beobachtungen`, el.BeobId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${id}/beobNichtBeurteilt`, `beobNichtBeurteilt/${el.BeobId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
