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
        "ApArtId"
      FROM
        apflora.pop
      WHERE
        "ApArtId" = ${id}
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
      type: `dataset`,
      table: `pop`,
      id: pop.PopId,
      name: pop.name,
      expanded: false,
      children: [0],
    }))

    // build apziel
    const zielListe = yield app.db.any(`
      SELECT
        apflora.ziel."ApArtId",
        apflora.ziel."ZielId",
        apflora.ziel_typ_werte."ZieltypTxt",
        apflora.ziel."ZielJahr",
        apflora.ziel."ZielBezeichnung"
      FROM
        apflora.ziel
        LEFT JOIN apflora.ziel_typ_werte
        ON apflora.ziel."ZielTyp" = apflora.ziel_typ_werte."ZieltypId"
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        apflora.ziel."ZielJahr" DESC,
        "ZielBezeichnung"`
    )
    const zielFolderChildren = zielListe.map(ziel => ({
      nodeId: `ziel/${ziel.ZielId}`,
      type: `dataset`,
      table: `ziel`,
      id: ziel.ZielId,
      name: `${ziel.ZielJahr ? `${ziel.ZielJahr}` : `(kein Jahr)`}: ${ziel.ZielBezeichnung} (${ziel.ZieltypTxt})`,
      expanded: false,
      children: [0],
    }))

    // build erfkrit
    const erfkritListe = yield app.db.any(`
      SELECT
        "ErfkritId",
        "ApArtId",
        "BeurteilTxt",
        "ErfkritTxt",
        "BeurteilOrd"
      FROM
        apflora.erfkrit
        LEFT JOIN
          apflora.ap_erfkrit_werte
          ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "BeurteilOrd"`
    )
    const erfkritFolderChildren = erfkritListe.map(erfkrit => ({
      nodeId: `erfkrit/${erfkrit.ErfkritId}`,
      type: `dataset`,
      table: `erfkrit`,
      id: erfkrit.ErfkritId,
      name: `${erfkrit.BeurteilTxt ? `${erfkrit.BeurteilTxt}` : `(nicht beurteilt)`}: ${erfkrit.ErfkritTxt ? `${erfkrit.ErfkritTxt}` : `(keine Kriterien erfasst)`}`,
      expanded: false,
      children: [0],
    }))

    // build apber
    const apberListe = yield yield app.db.any(`
      SELECT
        "JBerId",
        "ApArtId",
        "JBerJahr"
      FROM
        apflora.apber
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "JBerJahr"`
    )
    const apberFolderChildren = apberListe.map(apber => ({
      nodeId: `apber/${apber.JBerId}`,
      type: `dataset`,
      table: `apber`,
      id: apber.JBerId,
      name: apber.JBerJahr ? apber.JBerJahr : `(kein Jahr)`,
      expanded: false,
      children: [0],
    }))

    // build ber
    const berListe = yield app.db.any(`
      SELECT
        "BerId",
        "ApArtId",
        "BerJahr",
        "BerTitel"
      FROM
        apflora.ber
      WHERE
        "ApArtId" = ${id}
      ORDER BY
        "BerJahr" DESC,
        "BerTitel"`
    )
    const berFolderChildren = berListe.map(ber => ({
      nodeId: `ber/${ber.BerId}`,
      type: `dataset`,
      table: `ber`,
      id: ber.BerId,
      name: `${ber.BerJahr ? `${ber.BerJahr}` : `(kein Jahr)`}: ${ber.BerTitel ? `${ber.BerTitel}` : `(kein Titel)`}`,
      expanded: false,
      children: [0],
    }))

    // build beobNichtBeurteilt
    const beobNichtBeurteiltListe = yield app.db.any(`
      SELECT
        beob.beob_bereitgestellt."BeobId",
        beob.beob_bereitgestellt."QuelleId",
        beob.beob_bereitgestellt."Datum",
        beob.beob_bereitgestellt."Autor",
        beob.beob_quelle.name AS "Quelle"
      FROM
        beob.beob_bereitgestellt
        LEFT JOIN beob.beob_quelle
        ON beob.beob_quelle.id = beob.beob_bereitgestellt."QuelleId"
      WHERE
        beob.beob_bereitgestellt."NO_ISFS" = ${id}
      ORDER BY
        beob.beob_bereitgestellt."Datum" DESC
      LIMIT 100`
    )
    const beobNichtBeurteiltFolderChildren = beobNichtBeurteiltListe.map(beob => ({
      nodeId: `beobNichtBeurteilt/${beob.BeobId}`,
      type: `dataset`,
      table: `beob_bereitgestellt`,
      id: beob.BeobId,
      name: `${beob.Datum ? `${beob.Datum}` : `(kein Datum)`}: ${beob.Autor ? `${beob.Autor}` : `(kein Autor)`} (${beob.Quelle})`,
      expanded: false,
      children: [0],
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
        beob.beob_quelle.name AS "Quelle"
      FROM
        apflora.beobzuordnung
        INNER JOIN
          beob.beob_bereitgestellt
          ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."BeobId"
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
      type: `dataset`,
      table: `beobzuordnung`,
      id: beob.NO_NOTE,
      name: `${beob.Datum ? `${beob.Datum}` : `(kein Datum)`}: ${beob.Autor ? `${beob.Autor}` : `(kein Autor)`} (${beob.Quelle})`,
      expanded: false,
      children: [0],
    }))

    // build assozarten
    const assozartenListe = yield app.db.any(`
      SELECT
        apflora.assozart."AaId",
        beob.adb_eigenschaften."Artname"
      FROM
        apflora.assozart
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
      type: `dataset`,
      table: `assozart`,
      id: assozart.AaId,
      name: assozart.Artname,
      expanded: false,
      children: [0],
    }))

    return [
      // qk folder
      {
        nodeId: `ap/${id}/qk`,
        type: `folder`,
        table: `ap`,
        id,
        name: `Qualitätskontrollen`,
        expanded: false,
        children: [],
      },
      // pop folder
      {
        nodeId: `ap/${id}/pop`,
        type: `folder`,
        table: `ap`,
        id,
        name: `Populationen (${popListe.length})`,
        expanded: false,
        children: popFolderChildren,
      },
      // ziel folder
      {
        nodeId: `ap/${id}/ziel`,
        type: `folder`,
        table: `ap`,
        id,
        name: `AP-Ziele (${zielListe.length})`,
        expanded: false,
        children: zielFolderChildren,
      },
      // erfkrit folder
      {
        nodeId: `ap/${id}/erfkrit`,
        type: `folder`,
        table: `ap`,
        id,
        name: `AP-Erfolgskriterien (${erfkritListe.length})`,
        expanded: false,
        children: erfkritFolderChildren,
      },
      // apber folder
      {
        nodeId: `ap/${id}/apber`,
        type: `folder`,
        table: `ap`,
        id,
        name: `AP-Berichte (${apberListe.length})`,
        expanded: false,
        children: apberFolderChildren,
      },
      // ber folder
      {
        nodeId: `ap/${id}/ber`,
        type: `folder`,
        table: `ap`,
        id,
        name: `Berichte (${berListe.length})`,
        expanded: false,
        children: berFolderChildren,
      },
      // beobNichtBeurteilt folder
      {
        nodeId: `ap/${id}/beobNichtBeurteilt`,
        type: `folder`,
        table: `ap`,
        id,
        name: `nicht beurteilte Beobachtungen (${beobNichtBeurteiltListe.length < 100 ? `` : `neuste `}${beobNichtBeurteiltListe.length})`,
        expanded: false,
        children: beobNichtBeurteiltFolderChildren,
      },
      // beobNichtZuzuordnen folder
      {
        nodeId: `ap/${id}/beobNichtZuzuordnen`,
        type: `folder`,
        table: `ap`,
        id,
        name: `nicht zuzuordnende Beobachtungen (${beobNichtZuzuordnenListe.length < 100 ? `` : `neuste `}${beobNichtZuzuordnenListe.length})`,
        expanded: false,
        children: beobNichtZuzuordnenFolderChildren,
      },
      // idealbiotop
      {
        nodeId: `idealbiotop/${id}`,
        type: `dataset`,
        table: `idealbiotop`,
        id,
        name: `Idealbiotop`,
        expanded: false,
        children: [],
      },
      // assozarten folder
      {
        nodeId: `ap/${id}/assozarten`,
        type: `folder`,
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
