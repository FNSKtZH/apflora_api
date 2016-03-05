'use strict'

const _ = require('lodash')
const async = require('async')
const escapeStringForSql = require('../escapeStringForSql')

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  // zuerst die Daten holen
  async.waterfall([
    (callback) => {
      request.pg.client.query(
        `SELECT
          "ZielId",
          "ZielTyp",
          "ZielJahr",
          "ZielBezeichnung"
        FROM
          apflora.ziel
        WHERE
          "ApArtId" = ${apId}
        ORDER BY
          "ZielTyp",
          "ZielBezeichnung"`,
        (err, apzielListe) => callback(err, apzielListe.rows)
      )
    },
    (apzielListe, callback) => {
      // the query errors out if there are no zielIds
      if (apzielListe.length > 0) {
        // Liste aller ZielId erstellen
        const zielIds = _.map(apzielListe, 'ZielId')
        request.pg.client.query(
          `SELECT
            "ZielBerId",
            "ZielId",
            "ZielBerJahr",
            "ZielBerErreichung"
          FROM
            apflora.zielber
          WHERE
            "ZielId" IN (${zielIds.join()})
          ORDER BY
            "ZielBerJahr",
            "ZielBerErreichung"`,
          // das Ergebnis der vorigen Abfrage anfügen
          (err, zielberListe) => callback(err, [apzielListe, zielberListe.rows])
        )
      } else {
        callback(null, [apzielListe, []])
      }
    }
  ], (err, result) => {
    if (err || !result) return reply(err, {})
    const apzielListe = result[0] || []
    const zielberListe = result[1] || []

    // in der apzielliste alls ZielJahr NULL mit '(kein Jahr)' ersetzen
    apzielListe.forEach((apziel) => {
      apziel.ZielJahr = apziel.ZielJahr || '(kein Jahr)'
    })

    let apzieljahre = _.union(_.map(apzielListe, 'ZielJahr'))
    apzieljahre.sort()
    // nodes für apzieljahre aufbauen
    let apzieleOrdnerNodeChildren = []
    let apzieleOrdnerNode = {
      data: 'AP-Ziele (' + apzielListe.length + ')',
      attr: {
        id: 'apOrdnerApziel' + apId,
        typ: 'apOrdnerApziel'
      },
      children: apzieleOrdnerNodeChildren
    }

    apzieljahre.forEach((zielJahr) => {
      const apziele = apzielListe.filter((apziel) => apziel.ZielJahr === zielJahr)
      // nodes für apziele aufbauen
      let apzieljahrNodeChildren = []
      let apzieljahrNode = {
        data: zielJahr + ' (' + apziele.length + ')',
        metadata: [apId],
        attr: {
          id: apId,
          typ: 'apzieljahr'
        },
        children: apzieljahrNodeChildren
      }
      apzieleOrdnerNodeChildren.push(apzieljahrNode)

      apziele.forEach(function (apziel) {
        const zielbere = zielberListe.filter((zielber) => zielber.ZielId === apziel.ZielId)
        // node für apziele aufbauen
        let apzielNodeChildren = []
        let apzielNode = {
          data: apziel.ZielBezeichnung || '(Ziel nicht beschrieben)',
          attr: {
            id: apziel.ZielId,
            typ: 'apziel'
          },
          children: apzielNodeChildren
        }
        apzieljahrNodeChildren.push(apzielNode)

        // ...und gleich seinen node für zielber-Ordner aufbauen
        let apzielOrdnerNodeChildren = []
        let apzielOrdnerNode = {
          data: 'Ziel-Berichte (' + zielbere.length + ')',
          attr: {
            id: apziel.ZielId,
            typ: 'zielberOrdner'
          },
          children: apzielOrdnerNodeChildren
        }
        apzielNodeChildren.push(apzielOrdnerNode)

        zielbere.forEach((zielber) => {
          let data = ''
          if (zielber.ZielBerJahr && zielber.ZielBerErreichung) {
            data = `${zielber.ZielBerJahr}: ${zielber.ZielBerErreichung}`
          } else if (zielber.ZielBerJahr) {
            data = `${zielber.ZielBerJahr} + : (keine Entwicklung)`
          } else if (zielber.ZielBerErreichung) {
            data = `(kein jahr): ${zielber.ZielBerErreichung}`
          } else {
            data = '(kein jahr): (keine Entwicklung)'
          }
          // nodes für zielbere aufbauen
          const zielberNode = {
            data: data,
            attr: {
              id: zielber.ZielBerId,
              typ: 'zielber'
            }
          }
          apzielOrdnerNodeChildren.push(zielberNode)
        })
      })
    })
    reply(null, apzieleOrdnerNode)
  })
}
