'use strict'

const app = require(`ampersand-app`)

module.exports = projId =>
  app.db.any(`
    SELECT
      "ProjId",
      "JbuJahr"
    FROM
      apflora.apberuebersicht
    WHERE
      apflora.apberuebersicht."ProjId" = ${projId}
    ORDER BY
      "JbuJahr"
    `
  )
    .then(apberuebersichtListe =>
      apberuebersichtListe.map(el => ({
        nodeId: `apberuebersicht/${el.JbuJahr}`,
        table: `apberuebersicht`,
        row: {
          JbuJahr: el.JbuJahr
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/apberuebersicht`, `apberuebersicht/${el.JbuJahr}`],
      }))
    )
    .then(nodes => nodes)
    .catch((error) => { throw error })
