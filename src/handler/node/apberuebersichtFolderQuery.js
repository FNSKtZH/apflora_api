'use strict'

const app = require(`ampersand-app`)

module.exports = projId =>
  app.db.any(`
    SELECT
      apflora.apberuebersicht.*
    FROM
      apflora.apberuebersicht
    WHERE
      apflora.apberuebersicht."ProjId" = ${projId}
    ORDER BY
      "JbuJahr"
    `
  )
    .then(apberuebersichtListe =>
      apberuebersichtListe.map(row => ({
        nodeId: `apberuebersicht/${row.JbuJahr}`,
        table: `apberuebersicht`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `AP-Berichte`, row.JbuJahr],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/apberuebersicht`, `apberuebersicht/${row.JbuJahr}`],
      }))
    )
    .then(nodes => nodes)
    .catch((error) => { throw error })
