'use strict'

const app = require(`ampersand-app`)

module.exports = (request, callback) => {
  const messageId = encodeURIComponent(request.params.messageId)
  const userName = encodeURIComponent(request.params.userName)
  const date = new Date().toISOString()

  app.db
    .none(
      `
      INSERT INTO
        apflora.usermessage ("UserName","MessageId")
      VALUES
        ('${userName}',${messageId})
      ON CONFLICT DO NOTHING`
    )
    .then(row => callback(null, row))
    .catch(error => callback(error, null))
}
