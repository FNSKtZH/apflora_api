'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.many(`
    SELECT
      "ErfkritId",
      apflora.ap."ApArtId",
      "BeurteilTxt",
      "ErfkritTxt",
      "BeurteilOrd",
      apflora.ap."ProjId"
    FROM
      apflora.erfkrit
      INNER JOIN
        apflora.ap
        ON apflora.erfkrit."ApArtId" = apflora.ap."ApArtId"
      LEFT JOIN
        apflora.ap_erfkrit_werte
        ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
    WHERE
      apflora.ap."ApArtId" = ${id}
    ORDER BY
      "BeurteilOrd"`
  )
    .then(list =>
      list.map(el => ({
        nodeId: `erfkrit/${el.ErfkritId}`,
        table: `erfkrit`,
        id: el.ErfkritId,
        name: `${el.BeurteilTxt ? `${el.BeurteilTxt}` : `(nicht beurteilt)`}: ${el.ErfkritTxt ? `${el.ErfkritTxt}` : `(keine Kriterien erfasst)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `AP-Erfolgskriterien`, el.ErfkritId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
