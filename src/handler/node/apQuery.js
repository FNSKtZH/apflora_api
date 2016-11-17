'use strict'

const app = require(`ampersand-app`)

module.exports = ({ apArtId, children }) => {  // eslint-disable-line
  const popChildren = [0]
  const zielChildren = [0]
  const erfkritChildren = [0]
  const apberChildren = [0]
  const berChildren = [0]
  const beobNichtBeurteiltChildren = [0]
  const beobNichtZuzuordnenChildren = [0]
  const idealbiotopChildren = [0]
  const assozartenChildren = [0]
  const qkChildren = [0]

  return app.db.task(function* getData() {
    const row = yield app.db.oneOrNone(`
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
        row,
        id: apArtId,
        label: `Populationen (${row.AnzPop})`,
        expanded: false,
        children: popChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Populationen`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/pop`],
      },
      // ziel folder
      {
        nodeId: `ap/${apArtId}/ziel`,
        folder: `ziel`,
        table: `ap`,
        row,
        id: apArtId,
        label: `AP-Ziele (${row.AnzZiel})`,
        expanded: false,
        children: zielChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Ziele`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/ziel`],
      },
      // erfkrit folder
      {
        nodeId: `ap/${apArtId}/erfkrit`,
        folder: `erfkrit`,
        table: `ap`,
        row,
        id: apArtId,
        label: `AP-Erfolgskriterien (${row.AnzErfkrit})`,
        expanded: false,
        children: erfkritChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Erfolgskriterien`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/erfkrit`],
      },
      // apber folder
      {
        nodeId: `ap/${apArtId}/apber`,
        folder: `apber`,
        table: `ap`,
        row,
        id: apArtId,
        label: `AP-Berichte (${row.AnzApber})`,
        expanded: false,
        children: apberChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `AP-Berichte`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/apber`],
      },
      // ber folder
      {
        nodeId: `ap/${apArtId}/ber`,
        folder: `ber`,
        table: `ap`,
        row,
        id: apArtId,
        label: `Berichte (${row.AnzBer})`,
        expanded: false,
        children: berChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Berichte`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/ber`],
      },
      // beobNichtBeurteilt folder
      {
        nodeId: `ap/${apArtId}/beobNichtBeurteilt`,
        folder: `beobNichtBeurteilt`,
        table: `ap`,
        row,
        id: apArtId,
        label: `nicht beurteilte Beobachtungen (${row.AnzBeobNichtBeurteilt < 100 ? row.AnzBeobNichtBeurteilt : `neuste 100 von ${row.AnzBeobNichtBeurteilt}`})`,
        expanded: false,
        children: beobNichtBeurteiltChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `nicht-beurteilte-Beobachtungen`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/beobNichtBeurteilt`],
      },
      // beobNichtZuzuordnen folder
      {
        nodeId: `ap/${apArtId}/beobNichtZuzuordnen`,
        folder: `beobNichtZuzuordnen`,
        table: `ap`,
        row,
        id: apArtId,
        label: `nicht zuzuordnende Beobachtungen (${row.AnzBeobNichtZuzuordnen < 100 ? row.AnzBeobNichtZuzuordnen : `neuste 100 von ${row.AnzBeobNichtZuzuordnen}`})`,
        expanded: false,
        children: beobNichtZuzuordnenChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `nicht-zuzuordnende-Beobachtungen`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/beobNichtZuzuordnen`],
      },
      // idealbiotop folder
      {
        nodeId: `idealbiotop/${apArtId}`,
        table: `idealbiotop`,
        row,
        id: apArtId,
        label: `Idealbiotop`,
        expanded: false,
        children: idealbiotopChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Idealbiotop`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `idealbiotop/${apArtId}`],
      },
      // assozarten folder
      {
        nodeId: `ap/${apArtId}/assozart`,
        folder: `assozart`,
        table: `ap`,
        row,
        id: apArtId,
        label: `assoziierte Arten (${row.AnzAssozart})`,
        expanded: false,
        children: assozartenChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `assoziierte-Arten`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/assozart`],
      },
      // qk folder
      {
        nodeId: `ap/${apArtId}/qk`,
        folder: `qk`,
        table: `ap`,
        row,
        id: apArtId,
        label: `Qualitätskontrollen`,
        expanded: false,
        children: qkChildren,
        urlPath: [`Projekte`, row.ProjId, `Arten`, row.ApArtId, `Qualitätskontrollen`],
        nodeIdPath: [`projekt/${row.ProjId}`, `projekt/${row.ProjId}/ap`, `ap/${row.ApArtId}`, `ap/${apArtId}/qk`],
      },
    ]
  })
  .then(nodes => nodes)
  .catch((error) => { throw error })
}
