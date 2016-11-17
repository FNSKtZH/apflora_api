'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build tpop
  app.db.oneOrNone(`
    SELECT
      apflora.pop.*,
      apflora.ap."ProjId",
      apflora.ap."ApArtId",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.tpop
        WHERE
          apflora.tpop."PopId" = apflora.pop."PopId"
      ) AS "AnzTPop",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.popmassnber
        WHERE
          apflora.popmassnber."PopId" = apflora.pop."PopId"
      ) AS "AnzPopmassnber",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.popber
        WHERE
          apflora.popber."PopId" = apflora.pop."PopId"
      ) AS "AnzPopber"
    FROM
      apflora.pop
      INNER JOIN
        apflora.ap
        ON apflora.ap."ApArtId" = apflora.pop."ApArtId"
    WHERE
      apflora.pop."PopId" = ${id}
    `
  )
    .then(row => [
      // tpop folder
      {
        nodeId: `pop/${id}/tpop`,
        folder: `tpop`,
        table: `pop`,
        row,
        id,
        label: `Teil-Populationen (${row.AnzTPop})`,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, id, `Teil-Populationen`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${id}`, `pop/${id}/tpop`],
      },
      // popber folder
      {
        nodeId: `pop/${id}/popber`,
        folder: `popber`,
        table: `pop`,
        row,
        id,
        label: `Kontroll-Berichte (${row.AnzPopber})`,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, id, `Kontroll-Berichte`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popber`],
      },
      // popmassnber folder
      {
        nodeId: `pop/${id}/popmassnber`,
        folder: `popmassnber`,
        table: `pop`,
        row,
        id,
        label: `Massnahmen-Berichte (${row.AnzPopmassnber})`,
        expanded: false,
        children: [0],
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`, id, `Massnahmen-Berichte`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${row.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popmassnber`],
      },
    ])
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
