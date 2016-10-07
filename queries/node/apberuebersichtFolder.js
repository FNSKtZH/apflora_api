'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "ProjId",
      "JbuJahr"
    FROM
      apflora.apberuebersicht
    WHERE
      apflora.apberuebersicht."ProjId" = ${id}
    ORDER BY
      "JbuJahr"
    `
  )
    .then(apberuebersichtListe =>
      apberuebersichtListe.map(el => ({
        nodeId: `apberuebersicht/${el.JbuJahr}`,
        table: `apberuebersicht`,
        id: el.JbuJahr,
        name: el.JbuJahr,
        expanded: false,
        path: [`Projekte`, el.ProjId, `AP-Berichte`, el.JbuJahr]
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
