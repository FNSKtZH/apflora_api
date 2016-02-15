'use strict'

const mysql = require('mysql')
const config = require('../../configuration')
const escapeStringForSql = require('../escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'beob'
})

function buildChildrenFromData (data) {
  return data.map(beob => {
    const datum = beob.Datum || '(kein Datum)'
    const autor = beob.Autor || '(kein Autor)'

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

  connection.query(
    `SELECT beob.beob_bereitgestellt.NO_ISFS, apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, beob.beob_bereitgestellt.Datum, beob.beob_bereitgestellt.Autor, "infospezies" AS beobtyp FROM apflora.beobzuordnung INNER JOIN beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = beob.beob_bereitgestellt.NO_NOTE WHERE apflora.beobzuordnung.NO_NOTE IS NOT NULL AND apflora.beobzuordnung.beobNichtZuordnen=1 AND beob.beob_bereitgestellt.NO_ISFS = ${apId} UNION SELECT beob.beob_bereitgestellt.NO_ISFS, apflora.beobzuordnung.NO_NOTE, apflora.beobzuordnung.beobNichtZuordnen, apflora.beobzuordnung.BeobBemerkungen, apflora.beobzuordnung.BeobMutWann, apflora.beobzuordnung.BeobMutWer, beob.beob_bereitgestellt.Datum, beob.beob_bereitgestellt.Autor, "evab" AS beobtyp FROM apflora.beobzuordnung INNER JOIN beob.beob_bereitgestellt ON apflora.beobzuordnung.NO_NOTE = beob.beob_bereitgestellt.NO_NOTE_PROJET WHERE apflora.beobzuordnung.NO_NOTE IS NOT NULL AND apflora.beobzuordnung.beobNichtZuordnen=1 AND beob.beob_bereitgestellt.NO_ISFS = ${apId} ORDER BY Datum DESC LIMIT 100`,
    (err, data) => {
      if (err) return reply(err)
      const node = {
        data: `nicht zuzuordnende Beobachtungen (${data.length < 100 ? '' : 'neuste '}${data.length})`,
        attr: {
          id: 'apOrdnerBeobNichtZuzuordnen' + apId,
          typ: 'apOrdnerBeobNichtZuzuordnen'
        },
        children: buildChildrenFromData(data)
      }

      reply(null, node)
    }
  )
}
