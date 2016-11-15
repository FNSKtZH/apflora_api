'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.assozart."AaId",
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
      apListe.map(el => ({
        nodeId: `assozart/${el.AaId}`,
        table: `assozart`,
        row: {
          AaId: el.AaId,
        },
        name: `${el.Artname ? el.Artname : `(keine Art gewählt)`}`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `assoziierte-Arten`, el.AaId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${id}/assozart`, `assozart/${el.AaId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
