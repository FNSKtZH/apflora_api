'use strict'

const app = require(`ampersand-app`)

// TODO: get real user

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  const user = 23

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.task(function* getData() {
    const projects = yield app.db.many(`
      SELECT
        "ProjId",
        "ProjName"
      FROM
        apflora.projekt
      WHERE
        "ProjId" IN (
          SELECT
            "ProjId"
          FROM
            apflora.userprojekt
          WHERE
            "UserId" = $1
        )
      ORDER BY
        "ProjName"
      `,
      user
    )
    const nodes = projects.map((projekt) => {
      const idActive = !!id && id === projekt.ProjId
      const oneProject = projects.length === 1
      return {
        nodeId: `projekt/${projekt.ProjId}`,
        datasetId: projekt.ProjId,
        type: `dataset`,
        name: projekt.ProjName,
        expanded: idActive || oneProject,
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
      const childrenAps = apListe.filter(el => el.ProjId === node.datasetId)
      // build nodes for ap
      const children = childrenAps.map(ap => ({
        nodeId: `ap/${ap.ApArtId}`,
        datasetId: ap.ApArtId,
        type: `dataset`,
        name: ap.Artname,
        expanded: false,
        children: [],
      }))
      node.children = children
    })
    return nodes
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
