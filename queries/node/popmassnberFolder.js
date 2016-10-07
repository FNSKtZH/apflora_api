'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "PopMassnBerId",
      apflora.popmassnber."PopId",
      "PopMassnBerJahr",
      "BeurteilTxt",
      "BeurteilOrd",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.popmassnber
      LEFT JOIN
        apflora.tpopmassn_erfbeurt_werte
        ON "PopMassnBerErfolgsbeurteilung" = "BeurteilId"
      INNER JOIN
        apflora.pop
        ON apflora.popmassnber."PopId" = apflora.pop."PopId"
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.popmassnber."PopId" = ${id}
    ORDER BY
      "PopMassnBerJahr",
      "BeurteilOrd"`
  )
    .then(apListe =>
      apListe.map(el => ({
        nodeId: `popmassnber/${el.PopMassnBerId}`,
        table: `popmassnber`,
        id: el.PopMassnBerId,
        name: `${el.PopMassnBerJahr ? `${el.PopMassnBerJahr}` : `(kein Jahr)`}: ${el.BeurteilTxt ? `${el.BeurteilTxt}` : `(nicht beurteilt)`}`,
        expanded: false,
        urlPath: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Massnahmen-Berichte`, el.PopMassnBerId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
