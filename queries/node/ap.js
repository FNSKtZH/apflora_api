'use strict'

const app = require(`ampersand-app`)
const _ = require(`underscore`)
const ergaenzePopNrUmFuehrendeNullen = require(`../../src/ergaenzePopNrUmFuehrendeNullen`)

module.exports = (request, callback) => {
  let id = encodeURIComponent(request.query.id)

  if (id) {
    id = parseInt(id, 0)
  }

  // build pop
  app.db.task(function* getData() {
    const popListe = yield app.db.any(`
      SELECT
        "PopNr",
        "PopName",
        "PopId",
        apflora.ap."ApArtId",
        apflora.ap."ProjId"
      FROM
        apflora.pop
        INNER JOIN
          apflora.ap
          ON apflora.pop."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "PopNr",
        "PopName"`
    )
    // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
    // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
    const popNrMax = _.max(popListe, pop => pop.PopNr).PopNr
    popListe.forEach((pop) => {
      pop.PopNr = ergaenzePopNrUmFuehrendeNullen(popNrMax, pop.PopNr)
      // nodes für pop aufbauen
      if (pop.PopName && pop.PopNr) {
        pop.name = `${pop.PopNr}: ${pop.PopName}`
        pop.sort = pop.PopNr
      } else if (pop.PopNr) {
        pop.name = `${pop.PopNr}: (kein Name)`
        pop.sort = pop.PopNr
      } else if (pop.PopName) {
        pop.name = `(keine Nr): ${pop.PopName}`
        // pop ohne Nummern zuunterst sortieren
        pop.sort = 1000
      } else {
        pop.name = `(keine Nr, kein Name)`
        pop.sort = 1000
      }
    })
    const popFolderChildren = popListe.map(pop => ({
      nodeId: `pop/${pop.PopId}`,
      table: `pop`,
      id: pop.PopId,
      name: pop.name,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: pop.ProjId }, { table: `ap`, id: pop.ApArtId }, { table: `pop`, id: pop.PopId }],
    }))

    // build apziel
    const zielListe = yield app.db.any(`
      SELECT
        apflora.ziel."ApArtId",
        apflora.ziel."ZielId",
        apflora.ziel_typ_werte."ZieltypTxt",
        apflora.ziel."ZielJahr",
        apflora.ziel."ZielBezeichnung",
        apflora.ap."ProjId"
      FROM
        apflora.ziel
        INNER JOIN
          apflora.ap
          ON apflora.ziel."ApArtId" = apflora.ap."ApArtId"
        LEFT JOIN
          apflora.ziel_typ_werte
          ON apflora.ziel."ZielTyp" = apflora.ziel_typ_werte."ZieltypId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        apflora.ziel."ZielJahr" DESC,
        "ZielBezeichnung"`
    )
    const zielFolderChildren = zielListe.map(ziel => ({
      nodeId: `ziel/${ziel.ZielId}`,
      table: `ziel`,
      id: ziel.ZielId,
      name: `${ziel.ZielJahr ? `${ziel.ZielJahr}` : `(kein Jahr)`}: ${ziel.ZielBezeichnung} (${ziel.ZieltypTxt})`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: ziel.ProjId }, { table: `ap`, id: ziel.ApArtId }, { table: `ziel`, id: ziel.ZielId }],
    }))

    // build erfkrit
    const erfkritListe = yield app.db.any(`
      SELECT
        "ErfkritId",
        apflora.ap."ApArtId",
        "BeurteilTxt",
        "ErfkritTxt",
        "BeurteilOrd",
        apflora.ap."ProjId"
      FROM
        apflora.erfkrit
        INNER JOIN
          apflora.ap
          ON apflora.erfkrit."ApArtId" = apflora.ap."ApArtId"
        LEFT JOIN
          apflora.ap_erfkrit_werte
          ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "BeurteilOrd"`
    )
    const erfkritFolderChildren = erfkritListe.map(erfkrit => ({
      nodeId: `erfkrit/${erfkrit.ErfkritId}`,
      table: `erfkrit`,
      id: erfkrit.ErfkritId,
      name: `${erfkrit.BeurteilTxt ? `${erfkrit.BeurteilTxt}` : `(nicht beurteilt)`}: ${erfkrit.ErfkritTxt ? `${erfkrit.ErfkritTxt}` : `(keine Kriterien erfasst)`}`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: erfkrit.ProjId }, { table: `ap`, id: erfkrit.ApArtId }, { table: `erfkrit`, id: erfkrit.ErfkritId }],
    }))

    // build apber
    const apberListe = yield yield app.db.any(`
      SELECT
        "JBerId",
        apflora.ap."ApArtId",
        "JBerJahr",
        apflora.ap."ProjId"
      FROM
        apflora.apber
        INNER JOIN
          apflora.ap
          ON apflora.apber."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "JBerJahr"`
    )
    const apberFolderChildren = apberListe.map(apber => ({
      nodeId: `apber/${apber.JBerId}`,
      table: `apber`,
      id: apber.JBerId,
      name: apber.JBerJahr ? apber.JBerJahr : `(kein Jahr)`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: apber.ProjId }, { table: `ap`, id: apber.ApArtId }, { table: `apber`, id: apber.JBerId }],
    }))

    // build ber
    const berListe = yield app.db.any(`
      SELECT
        "BerId",
        apflora.ap."ApArtId",
        "BerJahr",
        "BerTitel",
        apflora.ap."ProjId"
      FROM
        apflora.ber
        INNER JOIN
          apflora.ap
          ON apflora.ber."ApArtId" = apflora.ap."ApArtId"
      WHERE
        apflora.ap."ApArtId" = ${id}
      ORDER BY
        "BerJahr" DESC,
        "BerTitel"`
    )
    const berFolderChildren = berListe.map(ber => ({
      nodeId: `ber/${ber.BerId}`,
      table: `ber`,
      id: ber.BerId,
      name: `${ber.BerJahr ? `${ber.BerJahr}` : `(kein Jahr)`}: ${ber.BerTitel ? `${ber.BerTitel}` : `(kein Titel)`}`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: ber.ProjId }, { table: `ap`, id: ber.ApArtId }, { table: `ber`, id: ber.BerId }],
    }))

    // build beobNichtBeurteilt
    const beobNichtBeurteiltListe = yield app.db.any(`
      SELECT
        beob.beob_bereitgestellt."BeobId",
        beob.beob_bereitgestellt."QuelleId",
        beob.beob_bereitgestellt."Datum",
        beob.beob_bereitgestellt."Autor",
        beob.beob_quelle.name AS "Quelle",
        apflora.ap."ProjId",
        beob.beob_bereitgestellt."NO_ISFS"
      FROM
        beob.beob_bereitgestellt
        INNER JOIN
          apflora.ap
          ON beob.beob_bereitgestellt."NO_ISFS" = apflora.ap."ApArtId"
        LEFT JOIN
          beob.beob_quelle
          ON beob.beob_quelle.id = beob.beob_bereitgestellt."QuelleId"
      WHERE
        beob.beob_bereitgestellt."NO_ISFS" = ${id}
      ORDER BY
        beob.beob_bereitgestellt."Datum" DESC
      LIMIT 100`
    )
    const beobNichtBeurteiltFolderChildren = beobNichtBeurteiltListe.map(beob => ({
      nodeId: `beobNichtBeurteilt/${beob.BeobId}`,
      table: `beob_bereitgestellt`,
      id: beob.BeobId,
      name: `${beob.Datum ? `${beob.Datum}` : `(kein Datum)`}: ${beob.Autor ? `${beob.Autor}` : `(kein Autor)`} (${beob.Quelle})`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: beob.ProjId }, { table: `ap`, id: beob.NO_ISFS }, { table: `beobNichtBeurteilt`, id: beob.BeobId }],
    }))

    // build beobNichtZuzuordnen
    const beobNichtZuzuordnenListe = yield app.db.any(`
      SELECT
        beob.beob_bereitgestellt."NO_ISFS",
        apflora.beobzuordnung."NO_NOTE",
        apflora.beobzuordnung."BeobNichtZuordnen",
        apflora.beobzuordnung."BeobBemerkungen",
        apflora.beobzuordnung."BeobMutWann",
        apflora.beobzuordnung."BeobMutWer",
        beob.beob_bereitgestellt."Datum",
        beob.beob_bereitgestellt."Autor",
        beob.beob_quelle.name AS "Quelle",
        apflora.ap."ProjId"
      FROM
        apflora.beobzuordnung
        INNER JOIN
          beob.beob_bereitgestellt
          ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
          INNER JOIN
            apflora.ap
            ON beob.beob_bereitgestellt."NO_ISFS" = apflora.ap."ApArtId"
          LEFT JOIN
            beob.beob_quelle
            ON beob.beob_quelle.id = beob.beob_bereitgestellt."QuelleId"
      WHERE
        apflora.beobzuordnung."NO_NOTE" IS NOT NULL
        AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
        AND beob.beob_bereitgestellt."NO_ISFS" = ${id}
      ORDER BY
        "Datum" DESC
      LIMIT
        100`
    )
    const beobNichtZuzuordnenFolderChildren = beobNichtZuzuordnenListe.map(beob => ({
      nodeId: `beobNichtZuzuordnen/${beob.NO_NOTE}`,
      table: `beobzuordnung`,
      id: beob.NO_NOTE,
      name: `${beob.Datum ? `${beob.Datum}` : `(kein Datum)`}: ${beob.Autor ? `${beob.Autor}` : `(kein Autor)`} (${beob.Quelle})`,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: beob.ProjId }, { table: `ap`, id: beob.NO_ISFS }, { table: `beobNichtZuzuordnen`, id: beob.NO_NOTE }],
    }))

    // build assozarten
    const assozartenListe = yield app.db.any(`
      SELECT
        apflora.assozart."AaId",
        beob.adb_eigenschaften."Artname",
        apflora.ap."ProjId",
        apflora.ap."ApArtId"
      FROM
        apflora.assozart
        INNER JOIN
          apflora.ap
          ON apflora.assozart."AaApArtId" = apflora.ap."ApArtId"
        LEFT JOIN
          beob.adb_eigenschaften
          ON apflora.assozart."AaSisfNr" = beob.adb_eigenschaften."TaxonomieId"
        WHERE
          apflora.assozart."AaApArtId" = ${id}
        ORDER BY
          beob.adb_eigenschaften."Artname"`
    )
    const assozartenFolderChildren = assozartenListe.map(assozart => ({
      nodeId: `assozarten/${assozart.AaId}`,
      table: `assozart`,
      id: assozart.AaId,
      name: assozart.Artname,
      expanded: false,
      children: [0],
      path: [{ table: `projekt`, id: assozart.ProjId }, { table: `ap`, id: assozart.ApArtId }, { table: `assozart`, id: assozart.AaId }],
    }))

    return [
      // qk folder
      {
        nodeId: `ap/${id}/qk`,
        folder: `qk`,
        table: `ap`,
        id,
        name: `Qualitätskontrollen`,
        expanded: false,
        children: [],
      },
      // pop folder
      {
        nodeId: `ap/${id}/pop`,
        folder: `pop`,
        table: `ap`,
        id,
        name: `Populationen (${popListe.length})`,
        expanded: false,
        children: popFolderChildren,
      },
      // ziel folder
      {
        nodeId: `ap/${id}/ziel`,
        folder: `ziel`,
        table: `ap`,
        id,
        name: `AP-Ziele (${zielListe.length})`,
        expanded: false,
        children: zielFolderChildren,
      },
      // erfkrit folder
      {
        nodeId: `ap/${id}/erfkrit`,
        folder: `erfkrit`,
        table: `ap`,
        id,
        name: `AP-Erfolgskriterien (${erfkritListe.length})`,
        expanded: false,
        children: erfkritFolderChildren,
      },
      // apber folder
      {
        nodeId: `ap/${id}/apber`,
        folder: `apber`,
        table: `ap`,
        id,
        name: `AP-Berichte (${apberListe.length})`,
        expanded: false,
        children: apberFolderChildren,
      },
      // ber folder
      {
        nodeId: `ap/${id}/ber`,
        folder: `ber`,
        table: `ap`,
        id,
        name: `Berichte (${berListe.length})`,
        expanded: false,
        children: berFolderChildren,
      },
      // beobNichtBeurteilt folder
      {
        nodeId: `ap/${id}/beobNichtBeurteilt`,
        folder: `beobNichtBeurteilt`,
        table: `ap`,
        id,
        name: `nicht beurteilte Beobachtungen (${beobNichtBeurteiltListe.length < 100 ? `` : `neuste `}${beobNichtBeurteiltListe.length})`,
        expanded: false,
        children: beobNichtBeurteiltFolderChildren,
      },
      // beobNichtZuzuordnen folder
      {
        nodeId: `ap/${id}/beobNichtZuzuordnen`,
        folder: `beobNichtZuzuordnen`,
        table: `ap`,
        id,
        name: `nicht zuzuordnende Beobachtungen (${beobNichtZuzuordnenListe.length < 100 ? `` : `neuste `}${beobNichtZuzuordnenListe.length})`,
        expanded: false,
        children: beobNichtZuzuordnenFolderChildren,
      },
      // idealbiotop
      {
        nodeId: `idealbiotop/${id}`,
        table: `idealbiotop`,
        id,
        name: `Idealbiotop`,
        expanded: false,
        children: [],
      },
      // assozarten folder
      {
        nodeId: `ap/${id}/assozarten`,
        folder: `assozarten`,
        table: `ap`,
        id,
        name: `assoziierte Arten (${assozartenListe.length})`,
        expanded: false,
        children: assozartenFolderChildren,
      },
    ]
  })
    .then(nodes => callback(null, nodes))
    .catch(error => callback(error, null))
}
