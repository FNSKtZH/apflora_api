'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const userName = encodeURIComponent(request.params.userName)
  const sql = `
    SELECT
      "MessageId"
    FROM
      apflora.usermessage
    WHERE
      apflora.usermessage."UserName" = $1`

  app.db.any(sql, userName).then(rows => callback(null, rows)).catch(error => {
    // expect to be no data
    if (error.status !== 500) {
      callback(error, null)
    }
  })
}
