'use strict'

const _ = require(`lodash`)
const escapeStringForSql = require(`../escapeStringForSql`)

function buildChildrenFromData(data) {
  return _.map(data, (assArt) => {
    return {
      data: assArt.Artname || `(keine Art gewählt)`,
      attr: {
        id: assArt.AaId,
        typ: `assozarten`
      }
    }
  })
}

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  request.pg.client.query(
    `SELECT
      apflora.assozart."AaId",
      beob.adb_eigenschaften."Artname"
    FROM
      apflora.assozart
      LEFT JOIN
        beob.adb_eigenschaften
        ON apflora.assozart."AaSisfNr" = beob.adb_eigenschaften."TaxonomieId"
      WHERE
        apflora.assozart."AaApArtId" = ${apId}
      ORDER BY
        beob.adb_eigenschaften."Artname"`,
    (err, data) => {
      if (err) return reply(err)
      const response = {
        data: `assoziierte Arten (` + data.rows.length + `)`,
        attr: {
          id: `apOrdnerAssozarten` + apId,
          typ: `apOrdnerAssozarten`
        },
        children: buildChildrenFromData(data.rows)
      }
      reply(null, response)
    }
  )
}
