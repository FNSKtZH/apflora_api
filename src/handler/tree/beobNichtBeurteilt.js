'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../../escapeStringForSql`)

const buildChildrenFromData = data =>
  data.map((beob) => {
    const datum = beob.Datum || `(kein Datum)`
    const autor = beob.Autor || `(kein Autor)`
    return {
      data: `${datum}: ${autor}`,
      attr: {
        typ: `beobNichtBeurteilt`,
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        id: `beob${beob.NO_NOTE ? beob.NO_NOTE : beob.NO_NOTE_PROJET}`,
        beobtyp: beob.NO_NOTE ? `infospezies` : `evab`
      }
    }
  })

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  const sql = `
    SELECT
      beob.beob_bereitgestellt."NO_NOTE",
      beob.beob_bereitgestellt."NO_NOTE_PROJET",
      beob.beob_bereitgestellt."NO_ISFS",
      beob.beob_bereitgestellt."Datum",
      beob.beob_bereitgestellt."Autor"
    FROM
      beob.beob_bereitgestellt
      LEFT JOIN
        apflora.beobzuordnung
        ON beob.beob_bereitgestellt."BeobId" = apflora.beobzuordnung."NO_NOTE"
    WHERE
      beob.beob_bereitgestellt."NO_ISFS" = ${apId}
      AND apflora.beobzuordnung."NO_NOTE" Is Null
    ORDER BY
      beob.beob_bereitgestellt."Datum" DESC
    LIMIT 100`

  app.db.any(sql)
    .then((rows) => {
      const node = {
        data: `nicht beurteilte Beobachtungen (${rows.length < 100 ? `` : `neuste `}${rows.length})`,
        attr: {
          id: `apOrdnerBeobNichtBeurteilt${apId}`,
          typ: `apOrdnerBeobNichtBeurteilt`
        },
        children: buildChildrenFromData(rows)
      }
      reply(null, node)
    })
    .catch(error => reply(error, null))
}
