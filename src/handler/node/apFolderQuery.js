'use strict'

const app = require(`ampersand-app`)
const apQuery = require(`./apQuery`)

module.exports = ({ projId, children }) =>
  app.db.task(function* getData() {
    let apChildren = [0]
    if (children.includes(`ap`)) {
      apChildren = yield apQuery(projId, children)
    }
    const apListe = yield app.db.any(`
      SELECT
        apflora.ap."ProjId",
        apflora.ap."ApArtId",
        beob.adb_eigenschaften."Artname"
      FROM
        apflora.ap
        INNER JOIN beob.adb_eigenschaften
        ON apflora.ap."ApArtId" = beob.adb_eigenschaften."TaxonomieId"
      WHERE
        apflora.ap."ProjId" = ${projId}
      ORDER BY
        beob.adb_eigenschaften."Artname"
      `
    )
    return apListe.map(ap => ({
      nodeId: `ap/${ap.ApArtId}`,
      table: `ap`,
      id: ap.ApArtId,
      name: ap.Artname,
      expanded: false,
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`],
      children: apChildren,
    }))
  })
    .then(nodes => nodes)
    .catch((error) => { throw error })
