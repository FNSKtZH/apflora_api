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
      // const oneProject = projects.length === 1  // temporarily disabled
      return {
        nodeId: `projekt/${projekt.ProjId}`,
        table: `projekt`,
        id: projekt.ProjId,
        name: projekt.ProjName,
        expanded: idActive, // || oneProject,  // temporarily disabled
        children: [],
        path: [{ table: `projekt`, id: projekt.ProjId }],
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
        table: `ap`,
        id: ap.ApArtId,
        name: ap.Artname,
        expanded: false,
        children: [0],
        path: [{ table: `projekt`, id: ap.ProjId }, { table: `ap`, id: ap.ApArtId }]
      }))
      node.children = children
    })
    return nodes
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
