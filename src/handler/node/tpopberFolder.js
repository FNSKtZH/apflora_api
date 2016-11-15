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
        row: {
          TPopBerId: el.TPopBerId,
          TPopBerJahr: el.TPopBerJahr,
          EntwicklungTxt: el.EntwicklungTxt,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, el.PopId, `Teil-Populationen`, id, `Kontroll-Berichte`, el.TPopBerId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${el.PopId}`, `pop/${el.PopId}/tpop`, `tpop/${id}/tpopber`, `tpopber/${el.TPopBerId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
