'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      beob.beob_bereitgestellt."NO_ISFS",
      apflora.beobzuordnung.*,
      beob.beob_bereitgestellt."Datum",
      beob.beob_bereitgestellt."Autor",
      beob.beob_quelle.name AS "Quelle",
      apflora.ap."ProjId",
      apflora.ap."ApArtId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        beob.beob_bereitgestellt
        ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
        INNER JOIN
          apflora.ap
          ON beob.beob_bereitgestellt."NO_ISFS" = apflora.ap."ApArtId"
        LEFT JOIN
          beob.beob_quelle
          ON beob.beob_quelle.id = beob.beob_bereitgestellt."QuelleId"
    WHERE
      apflora.beobzuordnung."NO_NOTE" IS NOT NULL
      AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
      AND beob.beob_bereitgestellt."NO_ISFS" = ${id}
    ORDER BY
      "Datum" DESC
    LIMIT
      100`
  )
    .then(apListe =>
      apListe.map(row => ({
        nodeId: `beobNichtZuzuordnen/${row.NO_NOTE}`,
        table: `beobzuordnung`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `nicht-zuzuordnende-Beobachtungen`, row.NO_NOTE],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/beobNichtZuzuordnen`, `beobNichtZuzuordnen/${row.NO_NOTE}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
