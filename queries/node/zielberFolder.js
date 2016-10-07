'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "ZielBerId",
      apflora.zielber."ZielId",
      "ZielBerJahr",
      "ZielBerErreichung",
      apflora.ap."ProjId",
      apflora.ap."ApArtId"
    FROM
      apflora.zielber
      INNER JOIN
        apflora.ziel
        ON apflora.ziel."ZielId" = apflora.zielber."ZielId"
        INNER JOIN
          apflora.ap
          ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.zielber."ZielId" = ${id}
    ORDER BY
      "ZielBerJahr",
      "ZielBerErreichung"`
  )
    .then(list =>
      list.map(el => ({
        nodeId: `zielber/${el.ZielBerId}`,
        table: `zielber`,
        id: el.ZielBerId,
        name: `${el.ZielBerJahr ? el.ZielBerJahr : `(kein Jahr)`}: ${el.ZielBerErreichung ? el.ZielBerErreichung : `(keine Entwicklung)`}`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Ziele`, id, `Berichte`, el.ZielBerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
