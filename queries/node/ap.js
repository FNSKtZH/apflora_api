'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.task(function* getData() {
    const aps = yield app.db.many(`
      SELECT
        apflora.ap."ApArtId",
        beob.adb_eigenschaften."Artname"
      FROM
        apflora.ap
        INNER JOIN apflora.beob.adb_eigenschaften
        ON apflora.ap."ApArtId" = apflora.beob.adb_eigenschaften."TaxonomieId"
      WHERE
        apflora.ap."ApArtId" = $1
      ORDER BY
        beob.adb_eigenschaften."Artname"
      `,
      id
    )
    const nodes = aps.map((ap) => {
      const idActive = !!id && id === ap.ApArtId
      return {
        nodeId: `ap/${ap.ApArtId}`,
        type: `dataset`,
        table: `ap`,
        id: ap.ApArtId,
        name: ap.Artname,
        expanded: idActive,
        children: [],
      }
    })
    const apListe = yield app.db.many(`
      SELECT
        apflora.ap."ProjId",
        apflora.ap."ApArtId",
        beob.adb_eigenschaften."Artname"
      FROM
        apflora.ap
        INNER JOIN beob.adb_eigenschaften
        ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      ORDER BY
        apflora.ap."ProjId",
        beob.adb_eigenschaften."Artname"
      `
    )
    nodes.forEach((node) => {
      const childrenAps = apListe.filter(el => el.ProjId === node.id)
      // build nodes for ap
      const children = childrenAps.map(ap => ({
        nodeId: `ap/${ap.ApArtId}`,
        type: `dataset`,
        table: `ap`,
        id: ap.ApArtId,
        name: ap.Artname,
        expanded: false,
        children: [0],
      }))
      node.children = children
    })
    return nodes
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
