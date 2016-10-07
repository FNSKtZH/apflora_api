'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      "TPopMassnId",
      apflora.tpopmassn."TPopId",
      "TPopMassnJahr",
      "TPopMassnDatum",
      "MassnTypTxt",
      apflora.pop."PopId",
      apflora.ap."ApArtId",
      apflora.ap."ProjId"
    FROM
      apflora.tpopmassn
      LEFT JOIN
        apflora.tpopmassn_typ_werte
        ON "TPopMassnTyp" = "MassnTypCode"
      INNER JOIN
        apflora.tpop
        ON apflora.tpopmassn."TPopId" = apflora.tpop."TPopId"
        INNER JOIN
          apflora.pop
          ON apflora.tpop."PopId" = apflora.pop."PopId"
          INNER JOIN
            apflora.ap
            ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
    WHERE
      apflora.tpopmassn."TPopId" = ${id}
    ORDER BY
      "TPopMassnJahr",
      "TPopMassnDatum",
      "MassnTypTxt"`
  )
    .then(liste =>
      liste.map(el => ({
        nodeId: `tpopmassn/${el.TPopMassnId}`,
        table: `tpopmassn`,
        id: el.TPopMassnId,
        name: `${el.TPopMassnJahr ? el.TPopMassnJahr : `(kein Jahr)`}: ${el.MassnTypTxt ? el.MassnTypTxt : `(kein Typ)`}`,
        expanded: false,
        path: [`Projekte`, el.ProjId, `Arten`, el.ApArtId, `Populationen`, id, `Teil-Populationen`, el.TPopId, `Massnahmen`, el.TPopMassnId],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
