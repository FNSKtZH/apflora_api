'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

const buildChildrenFromData = data =>
  data.map((ber) => {
    const berjahrText = ber.BerJahr || `(kein Jahr)`
    const bertitelText = ber.BerTitel || `(kein Titel)`
    const beschriftung = `${berjahrText}: ${bertitelText}`

    return {
      data: beschriftung,
      attr: {
        id: ber.BerId,
        typ: `ber`
      }
    }
  })

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  app.db.any(`
    SELECT
      "BerId",
      "ApArtId",
      "BerJahr",
      "BerTitel"
    FROM
      apflora.ber
    WHERE
      "ApArtId" = ${apId}
    ORDER BY
      "BerJahr" DESC,
      "BerTitel"`
  )
    .then((rows) => {
      const node = {
        data: `Berichte (${rows.length})`,
        attr: {
          id: `apOrdnerBer${apId}`,
          typ: `apOrdnerBer`
        },
        children: buildChildrenFromData(rows)
      }
      reply(null, node)
    })
    .catch(error => reply(error, null))
}
