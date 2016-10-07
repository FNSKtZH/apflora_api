'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.ap."ProjId",
      apflora.ap."ApArtId",
      beob.adb_eigenschaften."Artname"
    FROM
      apflora.ap
      INNER JOIN beob.adb_eigenschaften
      ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
    WHERE
      apflora.ap."ProjId" = ${id}
    ORDER BY
      beob.adb_eigenschaften."Artname"
    `
  )
    .then(apListe =>
      apListe.map(ap => ({
        nodeId: `ap/${ap.ApArtId}`,
        table: `ap`,
        id: ap.ApArtId,
        name: ap.Artname,
        expanded: false,
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId],
        children: [0],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
