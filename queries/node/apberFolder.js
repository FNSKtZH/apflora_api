'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "JBerId",
      apflora.ap."ApArtId",
      "JBerJahr",
      apflora.ap."ProjId"
    FROM
      apflora.apber
      INNER JOIN
        apflora.ap
        ON apflora.apber."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "JBerJahr"`
  )
    .then(list =>
      list.map(el => ({
        nodeId: `apber/${el.JBerId}`,
        table: `apber`,
        id: el.JBerId,
        name: el.JBerJahr ? el.JBerJahr : `(kein Jahr)`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Berichte`, el.JBerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
