'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.beobzuordnung.*,
      beob.beob_bereitgestellt."Datum",
      beob.beob_bereitgestellt."Autor",
      'evab' AS "beobtyp",
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.beobzuordnung
      INNER JOIN
        beob.beob_bereitgestellt
        ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
      INNER JOIN
        apflora.tpop
        ON apflora.beobzuordnung."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.beobzuordnung."TPopId" = ${id}
      AND (
        apflora.beobzuordnung."BeobNichtZuordnen" = 0
        OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
      )`
  )
    .then(liste =>
      liste.map(row => ({
        nodeId: `beobzuordnung/${row.NO_NOTE}`,
        table: `beobzuordnung`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, id, `zugeordnete-Beobachtungen`, row.NO_NOTE],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${id}/beobzuordnung`, `beobzuordnung/${row.NO_NOTE}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
