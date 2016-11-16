'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.any(`
    SELECT
      apflora.tpopmassn.*,
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
      liste.map(row => ({
        nodeId: `tpopmassn/${row.TPopMassnId}`,
        table: `tpopmassn`,
        row,
        expanded: false,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, row.PopId, `Teil-Populationen`, id, `Massnahmen`, row.TPopMassnId],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${row.PopId}`, `pop/${row.PopId}/tpop`, `tpop/${row.TPopId}/tpopmassn`, `tpopmassn/${row.TPopMassnId}`],
      }))
    )
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
