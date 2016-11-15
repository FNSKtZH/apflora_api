'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "PopBerId",
      apflora.popber."PopId",
      "PopBerJahr",
      "EntwicklungTxt",
      "EntwicklungOrd",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.popber
      LEFT JOIN
        apflora.pop_entwicklung_werte
        ON "PopBerEntwicklung" = "EntwicklungId"
      INNER JOIN
        apflora.pop
        ON apflora.popber."PopId" = apflora.pop."PopId"
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.popber."PopId" = ${id}
    ORDER BY
      "PopBerJahr",
      "EntwicklungOrd"`
  )
    .then(apListe =>
      apListe.map(el => ({
        nodeId: `popber/${el.PopBerId}`,
        table: `popber`,
        row: {
          PopBerId: el.PopBerId,
          PopBerJahr: el.PopBerJahr,
          EntwicklungTxt: el.EntwicklungTxt,
        },
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Kontroll-Berichte`, el.PopBerId],
        nodeIdPath: [`projekt/${el.ProjId}`, `projekt/${el.ProjId}/ap`, `ap/${el.ApArtId}`, `ap/${el.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popber`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
