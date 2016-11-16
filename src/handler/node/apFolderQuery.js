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
        apflora.ap.*,
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
    return apListe.map(row => ({
      nodeId: `ap/${row.ApArtId}`,
      table: `ap`,
      row,
      expanded: false,
      urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId],
      nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`],
      children: apChildren,
    }))
  })
    .then(nodes => nodes)
    .catch((error) => { throw error })
