'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const escapeStringForSql = require(`../escapeStringForSql`)

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  let zieleListe = null
  let zielberListe = null

  app.db.task(function* getZiele() {
    // Ziele holen
    zieleListe = yield app.db.any(`
      SELECT
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
        "ZielBezeichnung"`
    )
    // the query errors out if there are no zielIds
    if (zieleListe.length > 0) {
      // Liste aller ZielId erstellen
      const zielIds = _.map(zieleListe, `ZielId`)
      zielberListe = yield app.db.any(`
        SELECT
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
          "ZielBerErreichung"`
      )
    }
    return
  })
    .then(() => {
      // in der apzielliste alls ZielJahr NULL mit '(kein Jahr)' ersetzen
      zieleListe.forEach((apziel) => {
        apziel.ZielJahr = apziel.ZielJahr || `(kein Jahr)`
      })

      const apzieljahre = _.union(_.map(zieleListe, `ZielJahr`))
      apzieljahre.sort()
      // nodes für apzieljahre aufbauen
      const apzieleOrdnerNodeChildren = []
      const apzieleOrdnerNode = {
        data: `AP-Ziele (${zieleListe.length})`,
        attr: {
          id: `apOrdnerApziel${apId}`,
          typ: `apOrdnerApziel`
        },
        children: apzieleOrdnerNodeChildren
      }

      apzieljahre.forEach((zielJahr) => {
        const apziele = zieleListe.filter(apziel => apziel.ZielJahr === zielJahr)
        // nodes für apziele aufbauen
        const apzieljahrNodeChildren = []
        const apzieljahrNode = {
          data: `${zielJahr} (${apziele.length})`,
          metadata: [apId],
          attr: {
            id: apId,
            typ: `apzieljahr`
          },
          children: apzieljahrNodeChildren
        }
        apzieleOrdnerNodeChildren.push(apzieljahrNode)

        apziele.forEach((apziel) => {
          const zielbere = zielberListe.filter(zielber => zielber.ZielId === apziel.ZielId)
          // node für apziele aufbauen
          const apzielNodeChildren = []
          const apzielNode = {
            data: apziel.ZielBezeichnung || `(Ziel nicht beschrieben)`,
            attr: {
              id: apziel.ZielId,
              typ: `apziel`
            },
            children: apzielNodeChildren
          }
          apzieljahrNodeChildren.push(apzielNode)

          // ...und gleich seinen node für zielber-Ordner aufbauen
          const apzielOrdnerNodeChildren = []
          const apzielOrdnerNode = {
            data: `Ziel-Berichte (${zielbere.length})`,
            attr: {
              id: apziel.ZielId,
              typ: `zielberOrdner`
            },
            children: apzielOrdnerNodeChildren
          }
          apzielNodeChildren.push(apzielOrdnerNode)

          zielbere.forEach((zielber) => {
            let data = ``
            if (zielber.ZielBerJahr && zielber.ZielBerErreichung) {
              data = `${zielber.ZielBerJahr}: ${zielber.ZielBerErreichung}`
            } else if (zielber.ZielBerJahr) {
              data = `${zielber.ZielBerJahr} : (keine Entwicklung)`
            } else if (zielber.ZielBerErreichung) {
              data = `(kein jahr): ${zielber.ZielBerErreichung}`
            } else {
              data = `(kein jahr): (keine Entwicklung)`
            }
            // nodes für zielbere aufbauen
            const zielberNode = {
              data,
              attr: {
                id: zielber.ZielBerId,
                typ: `zielber`
              }
            }
            apzielOrdnerNodeChildren.push(zielberNode)
          })
        })
      })
      reply(null, apzieleOrdnerNode)
    })
    .catch(error => reply(error, null))
}
