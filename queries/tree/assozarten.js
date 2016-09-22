'use strict'

const app = require(`ampersand-app`)
const _ = require(`lodash`)
const escapeStringForSql = require(`../escapeStringForSql`)

const buildChildrenFromData = data =>
  _.map(data, assArt => ({
    data: assArt.Artname || `(keine Art gewählt)`,
    attr: {
      id: assArt.AaId,
      typ: `assozarten`
    }
  }))

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)

  app.db.any(`
    SELECT
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
        beob.adb_eigenschaften."Artname"`
  )
    .then((rows) => {
      const response = {
        data: `assoziierte Arten (${rows.length})`,
        attr: {
          id: `apOrdnerAssozarten${apId}`,
          typ: `apOrdnerAssozarten`
        },
        children: buildChildrenFromData(rows)
      }
      reply(null, response)
    })
    .catch(error => reply(error, null))
}
