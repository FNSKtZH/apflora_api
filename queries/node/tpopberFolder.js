'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "TPopBerId",
      apflora.tpopber."TPopId",
      "TPopBerJahr",
      "EntwicklungTxt",
      "EntwicklungOrd",
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.tpopber
      LEFT JOIN
        apflora.tpop_entwicklung_werte
        ON "TPopBerEntwicklung" = "EntwicklungCode"
      INNER JOIN
        apflora.tpop
        ON apflora.tpopber."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpopber."TPopId" = ${id}
    ORDER BY
      "TPopBerJahr",
      "EntwicklungOrd"`
  )
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopber/${el.TPopBerId}`,
        table: `tpopber`,
        id: el.TPopBerId,
        name: `${el.TPopBerJahr ? el.TPopBerJahr : `(kein Jahr)`}: ${el.EntwicklungTxt ? el.EntwicklungTxt : `(nicht beurteilt)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Teil-Populationen`, el.TPopId, `Kontroll-Berichte`, el.TPopBerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
