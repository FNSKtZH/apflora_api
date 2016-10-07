'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "BerId",
      apflora.ap."ApArtId",
      "BerJahr",
      "BerTitel",
      apflora.ap."ProjId"
    FROM
      apflora.ber
      INNER JOIN
        apflora.ap
        ON apflora.ber."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "BerJahr" DESC,
      "BerTitel"`
  )
    .then(list =>
      list.map(el => ({
        nodeId: `ber/${el.BerId}`,
        table: `ber`,
        id: el.BerId,
        name: `${el.BerJahr ? `${el.BerJahr}` : `(kein Jahr)`}: ${el.BerTitel ? `${el.BerTitel}` : `(kein Titel)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Berichte`, el.BerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
