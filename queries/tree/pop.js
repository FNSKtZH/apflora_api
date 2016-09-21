'use strict'

const _ = require(`lodash`)
const async = require(`async`)
const escapeStringForSql = require(`../escapeStringForSql`)
const erstelleTpopOrdner = require(`./tpopOrdner`)
const erstellePopMassnBerOrdner = require(`./popMassnBerOrdner`)
const erstellePopBerOrdner = require(`./popBerOrdner`)

// erhält die höchste PopNr der Liste und die aktuelle
// stellt der aktuellen PopNr soviele Nullen voran, dass
// alle Nummern dieselbe Anzahl stellen haben
const ergaenzePopNrUmFuehrendeNullen = (popNrMax, popNr) => {
  /* jslint white: true, plusplus: true */
  if (!popNr && popNr !== 0) return null
  if (!popNrMax && popNrMax !== 0) return null

  // Nummern in Strings umwandeln
  popNrMax = popNrMax.toString()
  popNr = popNr.toString()

  let stellendifferenz = popNrMax.length - popNr.length

  // Voranzustellende Nullen generieren
  while (stellendifferenz > 0) {
    popNr = `0${popNr}`
    stellendifferenz--
  }

  return popNr
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  // zuerst die popliste holen
  async.waterfall([
    (callback) => {
      request.pg.client.query(
        `SELECT
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
          "PopName"`,
        (err, result) => {
          const popListe = result.rows
          const popIds = _.map(popListe, `PopId`)
          callback(err, popIds, popListe)
        }
      )
    },
    (popIds, popListe, callback) => {
      if (popIds.length > 0) {
        request.pg.client.query(
          `SELECT
            "TPopNr",
            "TPopFlurname",
            "TPopId",
            "PopId"
          FROM
            apflora.tpop
          WHERE
            "PopId" IN (${popIds.join()})
          ORDER BY
            "TPopNr",
            "TPopFlurname"`,
          (err, result) => {
            const tpopListe = result.rows
            const tpopIds = _.map(tpopListe, `TPopId`)
            callback(err, [popIds, tpopIds, popListe, tpopListe])
          }
        )
      } else {
        callback(null, [popIds, [], popListe, []])
      }
    }
  ], (err, result) => {
    const popIds = result[0]
    const tpopIds = result[1]
    const popListe = result[2]
    const tpopListe = result[3]

    if (tpopIds.length > 0) {
      // jetzt parallel alle übrigen Daten aus dem pop-baum
      async.parallel({
        tpopMassnListe(callback) {
          request.pg.client.query(
            `SELECT
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
              "TPopId" IN (${tpopIds.join()})
            ORDER BY
              "TPopMassnJahr",
              "TPopMassnDatum",
              "MassnTypTxt"`,
            (err, data) => callback(err, data.rows)
          )
        },
        tpopMassnBerListe(callback) {
          request.pg.client.query(
            `SELECT
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
              "TPopId" IN (${tpopIds.join()})
            ORDER BY
              "TPopMassnBerJahr",
              "BeurteilTxt"`,
            (err, data) => callback(err, data.rows)
          )
        },
        tpopFeldkontrListe(callback) {
          request.pg.client.query(
            `SELECT
             "TPopKontrId",
             "TPopId",
             "TPopKontrJahr",
             "TPopKontrTyp"
            FROM
              apflora.tpopkontr
            WHERE
             "TPopId" IN (${tpopIds.join()})
              AND (
               "TPopKontrTyp" <> 'Freiwilligen-Erfolgskontrolle'
               OR "TPopKontrTyp" IS NULL
              )
            ORDER BY
              "TPopKontrJahr",
              "TPopKontrTyp"`,
            (err, data) => callback(err, data.rows)
          )
        },
        tpopFreiwkontrListe(callback) {
          request.pg.client.query(
            `SELECT
              "TPopKontrId",
              "TPopId",
              "TPopKontrJahr",
              "TPopKontrTyp"
            FROM
              apflora.tpopkontr
            WHERE
              "TPopId" IN (${tpopIds.join()})
              AND "TPopKontrTyp" = 'Freiwilligen-Erfolgskontrolle'
            ORDER BY
              "TPopKontrJahr",
              "TPopKontrTyp"`,
            (err, data) => callback(err, data.rows)
          )
        },
        tpopBerListe(callback) {
          request.pg.client.query(
            `SELECT
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
              "TPopId" IN (${tpopIds.join()})
            ORDER BY
              "TPopBerJahr",
              "EntwicklungOrd"`,
            (err, data) => callback(err, data.rows)
          )
        },
        tpopBeobZugeordnetListe(callback) {
          request.pg.client.query(
            `SELECT
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
              apflora.beobzuordnung."TPopId" IN (${tpopIds.join()})
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
              apflora.beobzuordnung."TPopId" IN (${tpopIds.join()})
              AND (
                apflora.beobzuordnung."BeobNichtZuordnen" = 0
                OR apflora.beobzuordnung."BeobNichtZuordnen" IS NULL
              )
            ORDER BY
              "Datum"`,
            (err, data) => callback(err, data.rows)
          )
        },
        popBerListe(callback) {
          request.pg.client.query(
            `SELECT
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
              "PopId" IN (${popIds.join()})
            ORDER BY
              "PopBerJahr",
              "EntwicklungOrd"`,
            (err, data) => callback(err, data.rows)
          )
        },
        popMassnBerListe(callback) {
          request.pg.client.query(
            `SELECT
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
              "PopId" IN (${popIds.join()})
            ORDER BY
              "PopMassnBerJahr",
              "BeurteilOrd"`,
            (err, data) => callback(err, data.rows)
          )
        }
      }, (err, results) => {
        if (err) return reply(err)

        const popBerListe = results.popBerListe || []
        const popMassnBerListe = results.popMassnBerListe || []

        // node für apOrdnerPop aufbauen
        const popOrdnerNodeChildren = []
        const popOrdnerNode = {
          data: `Populationen (` + popListe.length + `)`,
          attr: {
            id: `apOrdnerPop` + apId,
            typ: `apOrdnerPop`
          },
          children: popOrdnerNodeChildren
        }

        // PopNr: Je nach Anzahl Stellen der maximalen PopNr bei denjenigen mit weniger Nullen
        // Nullen voranstellen, damit sie im tree auch als String richtig sortiert werden
        const popNrMax = _.maxBy(popListe, pop => pop.PopNr).PopNr

        popListe.forEach((pop) => {
          const popNodeChildren = []
          let data
          let popSort

          pop.PopNr = ergaenzePopNrUmFuehrendeNullen(popNrMax, pop.PopNr)

          // nodes für pop aufbauen
          if (pop.PopName && pop.PopNr) {
            data = pop.PopNr + `: ` + pop.PopName
            popSort = pop.PopNr
          } else if (pop.PopNr) {
            data = pop.PopNr + `: (kein Name)`
            popSort = pop.PopNr
          } else if (pop.PopName) {
            data = `(keine Nr): ` + pop.PopName
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
          const popTpopOrdnerNode = erstelleTpopOrdner(results, tpopListe, pop)
          popNodeChildren.push(popTpopOrdnerNode)

          // PopberOrdner aufbauen
          const popBerOrdnerNode = erstellePopBerOrdner(popBerListe, pop)
          popNodeChildren.push(popBerOrdnerNode)

          // MassnberOrdner aufbauen
          const popMassnberOrdnerNode = erstellePopMassnBerOrdner(popMassnBerListe, pop)
          popNodeChildren.push(popMassnberOrdnerNode)
        })
        reply(null, popOrdnerNode)
      })
    } else {
      // node für apOrdnerPop aufbauen
      const popOrdnerNode = {
        data: `Populationen (0)`,
        attr: {
          id: `apOrdnerPop` + apId,
          typ: `apOrdnerPop`
        },
        children: []
      }
      reply(null, popOrdnerNode)
    }
  })
}
