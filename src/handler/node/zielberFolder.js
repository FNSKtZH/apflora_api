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
        row: {
          ZielBerId: el.ZielBerId,
          ZielBerJahr: el.ZielBerJahr,
          ZielBerErreichung: el.ZielBerErreichung,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Ziele`, id, `Berichte`, el.ZielBerId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/ziel`, `ziel/${el.ZielId}`, `ziel/${el.ZielId}/zielber`, `zielber/${el.ZielBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
