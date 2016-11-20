'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)

module.exports = ({ apArtId, children }) => {  // eslint-disable-line
  const idealbiotopChildren = [0]
  const qkChildren = [0]

  return app.db.task(function* getData() {
    const ap = yield app.db.oneOrNone(`
      SELECT
        apflora.ap.*,
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
            LEFT JOIN
              apflora.beobzuordnung
              ON beob.beob_bereitgestellt."BeobId" = apflora.beobzuordnung."NO_NOTE"
          WHERE
            beob.beob_bereitgestellt."NO_ISFS" = ${apArtId}
            AND apflora.beobzuordnung."NO_NOTE" Is Null
        ) AS "AnzBeobNichtBeurteilt",
        (
          SELECT
            COUNT(*)
          FROM
            beob.beob_bereitgestellt
            INNER JOIN
              apflora.beobzuordnung
              ON beob.beob_bereitgestellt."BeobId" = apflora.beobzuordnung."NO_NOTE"
          WHERE
            beob.beob_bereitgestellt."NO_ISFS" = ${apArtId}
            AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
        ) AS "AnzBeobNichtZuzuordnen"
      FROM
        apflora.ap
      WHERE
        apflora.ap."ApArtId" = ${apArtId}
      `
    )
    return [
      // pop folder
      {
        nodeId: `ap/${apArtId}/pop`,
        folder: `pop`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzPop, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Populationen`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/pop`],
      },
      // ziel folder
      {
        nodeId: `ap/${apArtId}/ziel`,
        folder: `ziel`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzZiel, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Ziele`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/ziel`],
      },
      // erfkrit folder
      {
        nodeId: `ap/${apArtId}/erfkrit`,
        folder: `erfkrit`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzErfkrit, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Erfolgskriterien`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/erfkrit`],
      },
      // apber folder
      {
        nodeId: `ap/${apArtId}/apber`,
        folder: `apber`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzApber, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `AP-Berichte`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/apber`],
      },
      // ber folder
      {
        nodeId: `ap/${apArtId}/ber`,
        folder: `ber`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzBer, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Berichte`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/ber`],
      },
      // beobNichtBeurteilt folder
      {
        nodeId: `ap/${apArtId}/beobNichtBeurteilt`,
        folder: `beobNichtBeurteilt`,
        table: `ap`,
        row: ap,
        id: apArtId,
        folderLabel: `nicht beurteilte Beobachtungen (${ap.AnzBeobNichtBeurteilt < 100 ? ap.AnzBeobNichtBeurteilt : `neuste 100 von ${ap.AnzBeobNichtBeurteilt}`})`,
        expanded: false,
        children: _.times(ap.AnzBeobNichtBeurteilt, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-beurteilte-Beobachtungen`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/beobNichtBeurteilt`],
      },
      // beobNichtZuzuordnen folder
      {
        nodeId: `ap/${apArtId}/beobNichtZuzuordnen`,
        folder: `beobNichtZuzuordnen`,
        table: `ap`,
        row: ap,
        id: apArtId,
        folderLabel: `nicht zuzuordnende Beobachtungen (${ap.AnzBeobNichtZuzuordnen < 100 ? ap.AnzBeobNichtZuzuordnen : `neuste 100 von ${ap.AnzBeobNichtZuzuordnen}`})`,
        expanded: false,
        children: _.times(ap.AnzBeobNichtZuzuordnen, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `nicht-zuzuordnende-Beobachtungen`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/beobNichtZuzuordnen`],
      },
      // idealbiotop folder
      {
        nodeId: `idealbiotop/${apArtId}`,
        table: `idealbiotop`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: idealbiotopChildren,
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Idealbiotop`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `idealbiotop/${apArtId}`],
      },
      // assozarten folder
      {
        nodeId: `ap/${apArtId}/assozart`,
        folder: `assozart`,
        table: `ap`,
        row: ap,
        id: apArtId,
        expanded: false,
        children: _.times(ap.AnzAssozart, _.constant(0)),
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `assoziierte-Arten`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/assozart`],
      },
      // qk folder
      {
        nodeId: `ap/${apArtId}/qk`,
        folder: `qk`,
        table: `ap`,
        row: ap,
        id: apArtId,
        folderLabel: `Qualitätskontrollen`,
        expanded: false,
        children: qkChildren,
        urlPath: [`Projekte`, ap.ProjId, `Arten`, ap.ApArtId, `Qualitätskontrollen`],
        nodeIdPath: [`projekt/${ap.ProjId}`, `projekt/${ap.ProjId}/ap`, `ap/${ap.ApArtId}`, `ap/${apArtId}/qk`],
      },
    ]
  })
  .then(nodes => nodes)
  .catch((error) => { throw error })
}
