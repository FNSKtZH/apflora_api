'use strict'

const app = require(`ampersand-app`)

// TODO: get real user

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)
  const folder = encodeURIComponent(request.query.folder)
  const user = 23

  if (id) {
    id = parseInt(id, 0)
  }

  if (folder === `ap`) {

  } else if (folder === 'apberuebersicht') {

  }

  app.db.task(function* getData() {
    const apListe = yield app.db.many(`
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
    const apberuebersichtListe = yield app.db.any(`
      SELECT
        "ProjId",
        "JbuJahr"
      FROM
        apflora.apberuebersicht
      ORDER BY
        "JbuJahr"`
    )
    const projektNodes = projektListe.map((projekt) => {
      const idActive = !!id && id === projekt.ProjId
      // const oneProject = projektListe.length === 1  // temporarily disabled
      return {
        nodeId: `projekt/${projekt.ProjId}`,
        table: `projekt`,
        id: projekt.ProjId,
        name: projekt.ProjName,
        expanded: idActive, // || oneProject,  // temporarily disabled
        children: [
          // ap folder
          {
            nodeId: `proj/${id}/ap`,
            folder: `ap`,
            table: `projekt`,
            id,
            name: `Arten (${apListe.length})`,
            expanded: false,
            children: apFolderChildren,
            path: [
              { table: `projekt`, id }
            ],
          },
          // apberuebersicht folder
          {
            nodeId: `proj/${id}/apberuebersicht`,
            folder: `apberuebersicht`,
            table: `projekt`,
            id,
            name: `AP-Berichte: Jährliche Übersicht über alle Arten (${apberuebersichtListe.length})`,
            expanded: false,
            children: apberuebersichtFolderChildren,
            path: [
              { table: `projekt`, id }
            ],
          },
        ],
        path: [
          { table: `projekt`, id: projekt.ProjId }
        ],
      }
    })

    projektNodes.forEach((node) => {
      const childrenAps = apListe.filter(el => el.ProjId === node.id)
      // build nodes for ap
      const children = childrenAps.map(ap => ({
        nodeId: `ap/${ap.ApArtId}`,
        table: `ap`,
        id: ap.ApArtId,
        name: ap.Artname,
        expanded: false,
        children: [0],
        path: [
          { table: `projekt`, id: ap.ProjId },
          { table: `ap`, id: ap.ApArtId }
        ]
      }))

      node.children = children
    })



    // build apberuebersicht

    const apberuebersichtFolderChildren = apberuebersichtListe.map(apberuebersicht => ({
      nodeId: `apberuebersicht/${apberuebersicht.JbuJahr}`,
      table: `apberuebersicht`,
      id: apberuebersicht.JbuJahr,
      name: apberuebersicht.JbuJahr,
      expanded: false,
      children: [0],
      path: [
        { table: `projekt`, id: apberuebersicht.ProjId },
        { table: `ap`, id: apberuebersicht.ApArtId },
        { table: `apberuebersicht`, id: apberuebersicht.JbuJahr }
      ],
    }))
    return projektNodes
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
