'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const apId = encodeURIComponent(request.params.apId)
  const X = encodeURIComponent(request.params.X)
  const Y = encodeURIComponent(request.params.Y)
  const sql = `
    SELECT
      apflora.pop."PopNr",
      apflora.tpop."TPopNr",
      apflora.tpop."TPopId",
      apflora.tpop."TPopFlurname",
      SQRT(
        power(${X} - apflora.tpop."TPopXKoord", 2) +
        power(${Y} - apflora.tpop."TPopYKoord", 2)
      ) AS "DistZuTPop"
    FROM apflora.pop
      INNER JOIN
        apflora.tpop
        ON apflora.pop."PopId" = apflora.tpop."PopId"
    WHERE
      apflora.pop."ApArtId" = ${apId}
      AND apflora.tpop."TPopXKoord" IS NOT NULL
      AND apflora.tpop."TPopYKoord" IS NOT NULL
    ORDER BY
      "DistZuTPop"
    LIMIT 1`

  app.db.any(sql)
    .then(rows => callback(null, rows))
    .catch(error => callback(error, null))
}
