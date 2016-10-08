'use strict'

const app = require(`ampersand-app`)
const escapeStringForSql = require(`../escapeStringForSql`)

const buildChildrenFromData = data =>
  data.map((erfkrit) => {
    const beurteilText = erfkrit.BeurteilTxt || `(keine Beurteilung)`
    const erfkritText = erfkrit.ErfkritTxt || `(kein Kriterium)`
    const beschriftung = `${beurteilText}: ${erfkritText}`

    return {
      data: beschriftung,
      attr: {
        id: erfkrit.ErfkritId,
        typ: `erfkrit`
      }
    }
  })

module.exports = (request, reply) => {
  const apId = escapeStringForSql(request.params.apId)
  app.db.any(`
    SELECT
      "ErfkritId",
      "ApArtId",
      "BeurteilTxt",
      "ErfkritTxt",
      "BeurteilOrd"
    FROM
      apflora.erfkrit
      LEFT JOIN
        apflora.ap_erfkrit_werte
        ON apflora.erfkrit."ErfkritErreichungsgrad" = apflora.ap_erfkrit_werte."BeurteilId"
    WHERE
      "ApArtId" = ${apId}
    ORDER BY
      "BeurteilOrd"`
  )
    .then((rows) => {
      const node = {
        data: `AP-Erfolgskriterien (${rows.length})`,
        attr: {
          id: `apOrdnerErfkrit${apId}`,
          typ: `apOrdnerErfkrit`
        },
        children: buildChildrenFromData(rows)
      }
      reply(null, node)
    })
    .catch(error => reply(error, null))
}
