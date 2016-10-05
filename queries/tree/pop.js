'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const escapeStringForSql = require(`../escapeStringForSql`)
const erstelleTpopOrdner = require(`./tpopOrdner`)
const erstellePopMassnBerOrdner = require(`./popMassnBerOrdner`)
const erstellePopBerOrdner = require(`./popBerOrdner`)
const ergaenzeNrUmFuehrendeNullen = require(`../../src/ergaenzeNrUmFuehrendeNullen`)

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  const results = {
    popListe: [],
    popIds: [],
    popBerListe: [],
    popMassnBerListe: [],
    tpopListe: [],
    tpopIds: [],
    tpopMassnListe: [],
    tpopMassnBerListe: [],
    tpopFeldkontrListe: [],
    tpopFreiwkontrListe: [],
    tpopBerListe: [],
    tpopBeobZugeordnetListe: [],
  }

  app.db.task(function* getData() {
    results.popListe = yield app.db.any(`
      SELECT
        "PopNr",
        "PopName",
        "PopId",
        "ApArtId"
      FROM
        apflora.pop
      WHERE
        "ApArtId" = ${apId}
      ORDER BY
        "PopNr",
        "PopName"`
    )
    results.popIds = _.map(results.popListe, `PopId`)
    if (results.popIds.length > 0) {
      results.tpopListe = yield app.db.any(`
        SELECT
          "TPopNr",
          "TPopFlurname",
          "TPopId",
          "PopId"
        FROM
          apflora.tpop
        WHERE
          "PopId" IN (${results.popIds.join()})
        ORDER BY
          "TPopNr",
          "TPopFlurname"`
      )
      results.tpopIds = _.map(results.tpopListe, `TPopId`)
      results.popBerListe = yield app.db.any(`
        SELECT
          "PopBerId",
          "PopId",
          "PopBerJahr",
          "EntwicklungTxt",
          "EntwicklungOrd"
        FROM
          apflora.popber
          LEFT JOIN
            apflora.pop_entwicklung_werte
            ON "PopBerEntwicklung" = "EntwicklungId"
        WHERE
          "PopId" IN (${results.popIds.join()})
        ORDER BY
          "PopBerJahr",
          "EntwicklungOrd"`
      )
      results.popMassnBerListe = yield app.db.any(`
        SELECT
          "PopMassnBerId",
          "PopId",
          "PopMassnBerJahr",
          "BeurteilTxt",
          "BeurteilOrd"
        FROM
          apflora.popmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON "PopMassnBerErfolgsbeurteilung" = "BeurteilId"
        WHERE
          "PopId" IN (${results.popIds.join()})
        ORDER BY
          "PopMassnBerJahr",
          "BeurteilOrd"`
      )
    }
    if (results.tpopIds.length > 0) {
      results.tpopMassnListe = yield app.db.any(`
        SELECT
          "TPopMassnId",
          "TPopId",
          "TPopMassnJahr",
          "TPopMassnDatum",
          "MassnTypTxt"
        FROM
          apflora.tpopmassn
          LEFT JOIN
            apflora.tpopmassn_typ_werte
            ON "TPopMassnTyp" = "MassnTypCode"
        WHERE
          "TPopId" IN (${results.tpopIds.join()})
        ORDER BY
          "TPopMassnJahr",
          "TPopMassnDatum",
          "MassnTypTxt"`
      )
      results.tpopMassnBerListe = yield app.db.any(`
        SELECT
          "TPopMassnBerId",
          "TPopId",
          "TPopMassnBerJahr",
          "BeurteilTxt"
        FROM
          apflora.tpopmassnber
          LEFT JOIN
            apflora.tpopmassn_erfbeurt_werte
            ON "TPopMassnBerErfolgsbeurteilung" = "BeurteilId"
        WHERE
          "TPopId" IN (${results.tpopIds.join()})
        ORDER BY
          "TPopMassnBerJahr",
          "BeurteilTxt"`
      )
      results.tpopFeldkontrListe = yield app.db.any(`
        SELECT
         "TPopKontrId",
         "TPopId",
         "TPopKontrJahr",
         "TPopKontrTyp"
        FROM
          apflora.tpopkontr
        WHERE
         "TPopId" IN (${results.tpopIds.join()})
          AND (
           "TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
           OR "TPopKontrTyp" IS NULL
          )
        ORDER BY
          "TPopKontrJahr",
          "TPopKontrTyp"`
      )
      results.tpopFreiwkontrListe = yield app.db.any(`
        SELECT
          "TPopKontrId",
          "TPopId",
          "TPopKontrJahr",
          "TPopKontrTyp"
        FROM
          apflora.tpopkontr
        WHERE
          "TPopId" IN (${results.tpopIds.join()})
          AND "TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
        ORDER BY
          "TPopKontrJahr",
          "TPopKontrTyp"`
      )
      results.tpopBerListe = yield app.db.any(`
        SELECT
          "TPopBerId",
          "TPopId",
          "TPopBerJahr",
          "EntwicklungTxt",
          "EntwicklungOrd"
        FROM
          apflora.tpopber
          LEFT JOIN
            apflora.tpop_entwicklung_werte
            ON "TPopBerEntwicklung" = "EntwicklungCode"
        WHERE
          "TPopId" IN (${results.tpopIds.join()})
        ORDER BY
          "TPopBerJahr",
          "EntwicklungOrd"`
      )
      results.tpopBeobZugeordnetListe = yield app.db.any(`
        SELECT
          apflora.beobzuordnung."NO_NOTE",
          apflora.beobzuordnung."TPopId",
          apflora.beobzuordnung."BeobNichtZuordnen",
          apflora.beobzuordnung."BeobBemerkungen",
          apflora.beobzuordnung."BeobMutWann",
          apflora.beobzuordnung."BeobMutWer",
          beob.beob_bereitgestellt."Datum",
          beob.beob_bereitgestellt."Autor",
          'evab' AS "beobtyp"
        FROM
          apflora.beobzuordnung
          INNER JOIN
            beob.beob_bereitgestellt
            ON apflora.beobzuordnung."NO_NOTE" = beob.beob_bereitgestellt."NO_NOTE_PROJET"
        WHERE
          apflora.beobzuordnung."TPopId" IN (${results.tpopIds.join()})
          AND (
            apflora.beobzuordnung."BeobNichtZuordnen" = 0
            OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
          )
        UNION SELECT
          apflora.beobzuordnung."NO_NOTE",
          apflora.beobzuordnung."TPopId",
          apflora.beobzuordnung."BeobNichtZuordnen",
          apflora.beobzuordnung."BeobBemerkungen",
          apflora.beobzuordnung."BeobMutWann",
          apflora.beobzuordnung."BeobMutWer",
          beob.beob_bereitgestellt."Datum",
          beob.beob_bereitgestellt."Autor",
          'infospezies' AS "beobtyp"
        FROM
          apflora.beobzuordnung
          INNER JOIN
            beob.beob_bereitgestellt
            ON CAST(apflora.beobzuordnung."NO_NOTE" as CHAR(50)) = CAST(beob.beob_bereitgestellt."NO_NOTE" as CHAR(50))
        WHERE
          apflora.beobzuordnung."TPopId" IN (${results.tpopIds.join()})
          AND (
            apflora.beobzuordnung."BeobNichtZuordnen" = 0
            OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
          )
        ORDER BY
          "Datum"`
      )
    }
  })
    .then(() => {
      if (results.tpopIds.length > 0) {
        // node für apOrdnerPop aufbauen
        const popOrdnerNodeChildren = []
        const popOrdnerNode = {
          data: `Populationen (${results.popListe.length})`,
          attr: {
            id: `apOrdnerPop${apId}`,
            typ: `apOrdnerPop`
          },
          children: popOrdnerNodeChildren
        }

        // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
        // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
        const popNrMax = _.maxBy(results.popListe, pop => pop.PopNr).PopNr

        results.popListe.forEach((pop) => {
          const popNodeChildren = []
          let data
          let popSort

          pop.PopNr = ergaenzeNrUmFuehrendeNullen(popNrMax, pop.PopNr)

          // nodes für pop aufbauen
          if (pop.PopName && pop.PopNr) {
            data = `${pop.PopNr}: ${pop.PopName}`
            popSort = pop.PopNr
          } else if (pop.PopNr) {
            data = `${pop.PopNr}: (kein Name)`
            popSort = pop.PopNr
          } else if (pop.PopName) {
            data = `(keine Nr): ${pop.PopName}`
            // pop ohne Nummern zuunterst sortieren
            popSort = 1000
          } else {
            data = `(keine Nr, kein Name)`
            popSort = 1000
          }

          const popNode = {
            data,
            attr: {
              id: pop.PopId,
              typ: `pop`,
              sort: popSort
            },
            // popNode.children ist ein Array, der enthält: popOrdnerTpop, popOrdnerPopber, popOrdnerMassnber
            children: popNodeChildren
          }

          popOrdnerNodeChildren.push(popNode)

          // tpopOrdner aufbauen
          const popTpopOrdnerNode = erstelleTpopOrdner(results, pop)
          popNodeChildren.push(popTpopOrdnerNode)

          // PopberOrdner aufbauen
          const popBerOrdnerNode = erstellePopBerOrdner(results.popBerListe, pop)
          popNodeChildren.push(popBerOrdnerNode)

          // MassnberOrdner aufbauen
          const popMassnberOrdnerNode = erstellePopMassnBerOrdner(results.popMassnBerListe, pop)
          popNodeChildren.push(popMassnberOrdnerNode)
        })
        reply(null, popOrdnerNode)
      } else {
        // node für apOrdnerPop aufbauen
        const popOrdnerNode = {
          data: `Populationen (0)`,
          attr: {
            id: `apOrdnerPop${apId}`,
            typ: `apOrdnerPop`
          },
          children: []
        }
        reply(null, popOrdnerNode)
      }
    })
    .catch(error => reply(error, null))
}
