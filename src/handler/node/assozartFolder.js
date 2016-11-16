'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.assozart.*,
      beob.adb_eigenschaften."Artname",
      apflora.ap."ProjId",
      apflora.ap."ApArtId"
    FROM
      apflora.assozart
      INNER JOIN
        apflora.ap
        ON apflora.assozart."AaApArtId" = apflora.ap."ApArtId"
      LEFT JOIN
        beob.adb_eigenschaften
        ON apflora.assozart."AaSisfNr" = beob.adb_eigenschaften."TaxonomieId"
      WHERE
        apflora.assozart."AaApArtId" = ${id}
      ORDER BY
        beob.adb_eigenschaften."Artname"`
  )
    .then(apListe =>
      apListe.map(row => ({
        nodeId: `assozart/${row.AaId}`,
        table: `assozart`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `assoziierte-Arten`, row.AaId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${id}/assozart`, `assozart/${row.AaId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
