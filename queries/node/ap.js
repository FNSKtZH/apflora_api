'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  app.db.oneOrNone(`
    SELECT
      apflora.ap."ProjId",
      apflora.ap."ApArtId",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.pop
        WHERE
          apflora.pop."ApArtId" = apflora.ap."ApArtId"
      ) AS "AnzPop",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.assozart
        WHERE
          apflora.assozart."AaApArtId" = apflora.ap."ApArtId"
      ) AS "AnzAssozart",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.ziel
        WHERE
          apflora.ziel."ApArtId" = apflora.ap."ApArtId"
      ) AS "AnzZiel",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.erfkrit
        WHERE
          apflora.erfkrit."ApArtId" = apflora.ap."ApArtId"
      ) AS "AnzErfkrit",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.apber
        WHERE
          apflora.apber."ApArtId" = apflora.ap."ApArtId"
      ) AS "AnzApber",
      (
        SELECT
          COUNT(*)
        FROM
          apflora.ber
        WHERE
          apflora.ber."ApArtId" = apflora.ap."ApArtId"
      ) AS "AnzBer",
      (
        SELECT
          COUNT(*)
        FROM
          beob.beob_bereitgestellt
        WHERE
          beob.beob_bereitgestellt."NO_ISFS" = ${id}
      ) AS "AnzBeobNichtBeurteilt",
      (
        SELECT
          COUNT(*)
        FROM
          beob.beob_bereitgestellt
        WHERE
          beob.beob_bereitgestellt."NO_ISFS" = ${id}
      ) AS "AnzBeobNichtZuzuordnen"
    FROM
      apflora.ap
    WHERE
      apflora.ap."ApArtId" = ${id}
    `
  )
  .then(ap => [
    // pop folder
    {
      nodeId: `ap/${id}/pop`,
      folder: `pop`,
      table: `ap`,
      id,
      name: `Populationen (${ap.AnzPop})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Populationen`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/pop`],
    },
    // ziel folder
    {
      nodeId: `ap/${id}/ziel`,
      folder: `ziel`,
      table: `ap`,
      id,
      name: `AP-Ziele (${ap.AnzZiel})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Ziele`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/ziel`],
    },
    // erfkrit folder
    {
      nodeId: `ap/${id}/erfkrit`,
      folder: `erfkrit`,
      table: `ap`,
      id,
      name: `AP-Erfolgskriterien (${ap.AnzErfkrit})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Erfolgskriterien`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/erfkrit`],
    },
    // apber folder
    {
      nodeId: `ap/${id}/apber`,
      folder: `apber`,
      table: `ap`,
      id,
      name: `AP-Berichte (${ap.AnzApber})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Berichte`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/apber`],
    },
    // ber folder
    {
      nodeId: `ap/${id}/ber`,
      folder: `ber`,
      table: `ap`,
      id,
      name: `Berichte (${ap.AnzBer})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Berichte`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/ber`],
    },
    // beobNichtBeurteilt folder
    {
      nodeId: `ap/${id}/beobNichtBeurteilt`,
      folder: `beobNichtBeurteilt`,
      table: `ap`,
      id,
      name: `nicht beurteilte Beobachtungen (${ap.AnzBeobNichtBeurteilt < 100 ? ap.AnzBeobNichtBeurteilt : `neuste 100 von ${ap.AnzBeobNichtBeurteilt}`})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-beurteilte-Beobachtungen`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/beobNichtBeurteilt`],
    },
    // beobNichtZuzuordnen folder
    {
      nodeId: `ap/${id}/beobNichtZuzuordnen`,
      folder: `beobNichtZuzuordnen`,
      table: `ap`,
      id,
      name: `nicht zuzuordnende Beobachtungen (${ap.AnzBeobNichtZuzuordnen < 100 ? ap.AnzBeobNichtZuzuordnen : `neuste 100 von ${ap.AnzBeobNichtZuzuordnen}`})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-zuzuordnende-Beobachtungen`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/beobNichtZuzuordnen`],
    },
    // idealbiotop folder
    {
      nodeId: `idealbiotop/${id}`,
      table: `idealbiotop`,
      id,
      name: `Idealbiotop`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Idealbiotop`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `idealbiotop/${id}`],
    },
    // assozarten folder
    {
      nodeId: `ap/${id}/assozart`,
      folder: `assozart`,
      table: `ap`,
      id,
      name: `assoziierte Arten (${ap.AnzAssozart})`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `assoziierte-Arten`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/assozart`],
    },
    // qk folder
    {
      nodeId: `ap/${id}/qk`,
      folder: `qk`,
      table: `ap`,
      id,
      name: `Qualitätskontrollen`,
      expanded: false,
      children: [0],
      urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Qualitätskontrollen`],
      nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${id}/qk`],
    },
  ])
  .then(nodes => callback(null, nodes))
  .catch(error => callback(error, null))
}
