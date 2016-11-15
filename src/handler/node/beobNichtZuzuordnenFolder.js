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
      apflora.beobzuordnung."NO_NOTE",
      apflora.beobzuordnung."BeobNichtZuordnen",
      apflora.beobzuordnung."BeobBemerkungen",
      apflora.beobzuordnung."BeobMutWann",
      apflora.beobzuordnung."BeobMutWer",
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
      apListe.map(el => ({
        nodeId: `beobNichtZuzuordnen/${el.NO_NOTE}`,
        table: `beobzuordnung`,
        row: {
          NO_NOTE: el.NO_NOTE,
          Datum: el.Datum,
          Autor: el.Autor,
          Quelle: el.Quelle,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `nicht-zuzuordnende-Beobachtungen`, el.NO_NOTE],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${id}/beobNichtZuzuordnen`, `beobNichtZuzuordnen/${el.NO_NOTE}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
