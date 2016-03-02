/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

// wird nur in Entwicklung genutzt
const serverOptionsDevelopment = {
  debug: {
    log: ['error'],
    request: ['error']
  }
}
const Hapi = require('hapi')
const Inert = require('inert')
const server = new Hapi.Server(serverOptionsDevelopment)
const mysql = require('mysql')
const config = require('./configuration.js')
const connectionApflora = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})

connectionApflora.connect()

server.register(Inert, function () {
  server.connection(require('./dbConnection.js'))
  server.route(require('./routes/anyGet.js'))
  server.route(require('./routes/srcGet.js'))
  server.route(require('./routes/styleImagesGet.js'))
  server.route(require('./routes/styleGet.js'))
  server.route(require('./routes/kmlGet.js'))
  server.route(require('./routes/geojsonGet.js'))
  server.route(require('./routes/imgGet.js'))
  server.route(require('./routes/gemeindenGet.js'))
  server.route(require('./routes/artlisteGet.js'))
  server.route(require('./routes/aplisteGet.js'))
  server.route(require('./routes/qkViewGet.js'))
  server.route(require('./routes/qkPopOhnePopberGet.js'))
  server.route(require('./routes/qkPopOhnePopmassnberGet.js'))
  server.route(require('./routes/qkTpopOhneTpopberGet.js'))
  server.route(require('./routes/qkTpopOhneMassnberGet.js'))
  server.route(require('./routes/anmeldungGet.js'))
  server.route(require('./routes/adressenGet.js'))
  server.route(require('./routes/apfloraGetFromTableByNumber.js'))
  server.route(require('./routes/beobGetFromTableByNumber.js'))
  server.route(require('./routes/apfloraGetFromTableByString.js'))
  server.route(require('./routes/beobGetFromTableByString.js'))
  server.route(require('./routes/apfloraPut.js'))
  server.route(require('./routes/apfloraPutMultiple.js'))
  server.route(require('./routes/beobPut.js'))
  server.route(require('./routes/apfloraPost.js'))
  server.route(require('./routes/apfloraPostMultiple.js'))
  server.route(require('./routes/tpopmassnPostKopie.js'))
  server.route(require('./routes/tpopkontrPostKopie.js'))
  server.route(require('./routes/tpopPostKopie.js'))
  server.route(require('./routes/tpopKoordFuerProgrammGet.js'))
  server.route(require('./routes/popPostKopie.js'))
  server.route(require('./routes/feldkontrPost.js'))
  server.route(require('./routes/apfloraDelete.js'))
  server.route(require('./routes/lrDelarzeGet.js'))
  server.route(require('./routes/tpopMassnTypenGet.js'))
  server.route(require('./routes/apGet.js'))
  server.route(require('./routes/apPost.js'))
  server.route(require('./routes/feldkontrZaehleinheitGet.js'))
  server.route(require('./routes/idealbiotopUebereinstGet.js'))
  server.route(require('./routes/treeGet.js'))
  server.route(require('./routes/beobDistzutpopEvabGet.js'))
  server.route(require('./routes/beobDistzutpopInfospeziesGet.js'))
  server.route(require('./routes/beobNaechsteTpopGet.js'))
  server.route(require('./routes/beobKarteGet.js'))
  server.route(require('./routes/beobZuordnenGet.js'))
  server.route(require('./routes/apKarteGet.js'))
  server.route(require('./routes/popKarteGet.js'))
  server.route(require('./routes/popKarteAlleGet.js'))
  server.route(require('./routes/popChKarteGet.js'))
  server.route(require('./routes/popsChKarteGet.js'))
  server.route(require('./routes/tpopKarteGet.js'))
  server.route(require('./routes/tpopsKarteGet.js'))
  server.route(require('./routes/tpopKarteAlleGet.js'))
  server.route(require('./routes/exportViewGetXslx.js'))
  server.route(require('./routes/exportViewGetCsv.js'))
  server.route(require('./routes/exportViewGetCsvForAp.js'))
  server.route(require('./routes/exportViewWhereIdInGet.js'))
  server.route(require('./routes/exportViewGetKml.js'))
  server.route(require('./routes/aktualisiereArteigenschaftenGet.js'))

  /* Versuch, funktioniert nicht*/
  server.route({
    method: 'GET',
    path: '/etc/{param*}',
    handler: {
      directory: {
        path: 'etc'
      }
    }
  })

/*
server.route({
    method: 'GET',
    path: '/etc/beziehungen.png',
    // vhost: ['api.apflora.ch', 'api.localhost'],
  handler (request, reply) {
        reply.file('etc/beziehungen.png')
    }
});*/
})

server.start(function (err) {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})

module.exports = server
