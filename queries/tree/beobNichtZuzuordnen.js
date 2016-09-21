'use strict'

const escapeStringForSql = require(`../escapeStringForSql`)

function buildChildrenFromData(data) {
  return data.map((beob) => {
    const datum = beob.Datum || `(kein Datum)`
    const autor = beob.Autor || `(kein Autor)`

    return {
      data: `${datum}: ${autor}`,
      attr: {
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        id: `beob${beob.NO_NOTE}`,
        typ: `beobNichtZuzuordnen`,
        beobtyp: beob.beobtyp
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  const sql = `
    SELECT
      beob.beob_bereitgestellt."NO_ISFS",
      apflora.beobzuordnung."NO_NOTE",
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
        ON apflora.beobzuordnung."NO_NOTE" = to_char(beob.beob_bereitgestellt."NO_NOTE", 'FM99999999')
    WHERE
      apflora.beobzuordnung."NO_NOTE" IS NOT NULL
      AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
      AND beob.beob_bereitgestellt."NO_ISFS" = ${apId}
    UNION SELECT
      beob.beob_bereitgestellt."NO_ISFS",
      apflora.beobzuordnung."NO_NOTE",
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
      apflora.beobzuordnung."NO_NOTE" IS NOT NULL
      AND apflora.beobzuordnung."BeobNichtZuordnen" = 1
      AND beob.beob_bereitgestellt."NO_ISFS" = ${apId}
    ORDER BY
      "Datum" DESC
    LIMIT
      100`

  request.pg.client.query(sql, (err, result) => {
    if (err) return reply(err)
    const data = result.rows
    const node = {
      data: `nicht zuzuordnende Beobachtungen (${data.length < 100 ? `` : `neuste `}${data.length})`,
      attr: {
        id: `apOrdnerBeobNichtZuzuordnen` + apId,
        typ: `apOrdnerBeobNichtZuzuordnen`
      },
      children: buildChildrenFromData(data)
    }

    reply(null, node)
  })
}
