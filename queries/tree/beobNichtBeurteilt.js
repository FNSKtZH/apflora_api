'use strict'

const mysql = require('mysql')
const config = require('../../configuration')
const escapeStringForSql = require('../escapeStringForSql')
const connection = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

const buildChildrenFromData = (data) => {
  return data.map(beob => {
    const datum = beob.Datum || '(kein Datum)'
    const autor = beob.Autor || '(kein Autor)'
    return {
      data: datum + ': ' + autor,
      attr: {
        typ: 'beobNichtBeurteilt',
        // beob voransetzen, damit die ID im ganzen Baum eindeutig ist
        id: `beob${beob.NO_NOTE ? beob.NO_NOTE : beob.NO_NOTE_PROJET}`,
        beobtyp: beob.NO_NOTE ? 'infospezies' : 'evab'
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  connection.query(
    `SELECT apflora_beob.beob_bereitgestellt.NO_NOTE, apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET, apflora_beob.beob_bereitgestellt.NO_ISFS, apflora_beob.beob_bereitgestellt.Datum, apflora_beob.beob_bereitgestellt.Autor FROM (apflora_beob.beob_bereitgestellt LEFT JOIN apflora.beobzuordnung ON apflora_beob.beob_bereitgestellt.NO_NOTE = apflora.beobzuordnung.NO_NOTE) LEFT JOIN apflora.beobzuordnung AS tblBeobZuordnung_1 ON apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET = tblBeobZuordnung_1.NO_NOTE WHERE apflora_beob.beob_bereitgestellt.NO_ISFS = ${apId} AND ((apflora_beob.beob_bereitgestellt.NO_NOTE_PROJET Is Not Null AND tblBeobZuordnung_1.NO_NOTE Is Null) OR (apflora_beob.beob_bereitgestellt.NO_NOTE Is Not Null AND apflora.beobzuordnung.NO_NOTE Is Null)) ORDER BY apflora_beob.beob_bereitgestellt.Datum DESC LIMIT 100`,
    (err, data) => {
      if (err) return reply(err)

      const node = {
        data: `nicht beurteilte Beobachtungen (${data.length < 100 ? '' : 'neuste '}${data.length})`,
        attr: {
          id: `apOrdnerBeobNichtBeurteilt${apId}`,
          typ: 'apOrdnerBeobNichtBeurteilt'
        },
        children: buildChildrenFromData(data)
      }

      reply(null, node)
    }
  )
}
