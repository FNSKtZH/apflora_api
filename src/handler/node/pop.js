'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build tpop
  app.db.oneOrNone(`
    SELECT
      "PopId",
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
    .then(pop => [
      // tpop folder
      {
        nodeId: `pop/${id}/tpop`,
        folder: `tpop`,
        table: `pop`,
        id,
        expanded: false,
        children: _.times(pop.AnzTPop, _.constant(0)),
        urlPath: [`Projekte`, pop.ProjId, `Arten`, pop.ApArtId, `Populationen`, id, `Teil-Populationen`],
        nodeIdPath: [`projekt/${pop.ProjId}`, `projekt/${pop.ProjId}/ap`, `ap/${pop.ApArtId}`, `ap/${pop.ApArtId}/pop`, `pop/${id}`, `pop/${id}/tpop`],
      },
      // popber folder
      {
        nodeId: `pop/${id}/popber`,
        folder: `popber`,
        table: `pop`,
        id,
        expanded: false,
        children: _.times(pop.AnzPopber, _.constant(0)),
        urlPath: [`Projekte`, pop.ProjId, `Arten`, pop.ApArtId, `Populationen`, id, `Kontroll-Berichte`],
        nodeIdPath: [`projekt/${pop.ProjId}`, `projekt/${pop.ProjId}/ap`, `ap/${pop.ApArtId}`, `ap/${pop.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popber`],
      },
      // popmassnber folder
      {
        nodeId: `pop/${id}/popmassnber`,
        folder: `popmassnber`,
        table: `pop`,
        id,
        expanded: false,
        children: _.times(pop.AnzPopmassnber, _.constant(0)),
        urlPath: [`Projekte`, pop.ProjId, `Arten`, pop.ApArtId, `Populationen`, id, `Massnahmen-Berichte`],
        nodeIdPath: [`projekt/${pop.ProjId}`, `projekt/${pop.ProjId}/ap`, `ap/${pop.ApArtId}`, `ap/${pop.ApArtId}/pop`, `pop/${id}`, `pop/${id}/popmassnber`],
      },
    ])
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
