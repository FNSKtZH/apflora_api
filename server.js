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
const treeQualitaetskontrollen = require('./queries/tree/qualitaetskontrollen.js')
const treeAssozarten = require('./queries/tree/assozarten.js')
const treeIdealbiotop = require('./queries/tree/idealbiotop.js')
const treeBeobNichtZuzuordnen = require('./queries/tree/beobNichtZuzuordnen.js')
const treeBeobNichtBeurteilt = require('./queries/tree/beobNichtBeurteilt.js')
const treeBer = require('./queries/tree/ber.js')
const treeJBer = require('./queries/tree/jber.js')
const treeErfkrit = require('./queries/tree/erfkrit.js')
const treeApziel = require('./queries/tree/apziel.js')
const treePop = require('./queries/tree/pop.js')
const queryBeobDistzutpopInfospezies = require('./queries/beobDistzutpopInfospezies.js')
const queryPopKarte = require('./queries/popKarte.js')
const queryPopKarteAlle = require('./queries/popKarteAlle.js')
const queryPopChKarte = require('./queries/popChKarte.js')
const queryPopsChKarte = require('./queries/popsChKarte.js')
const queryTPopKarte = require('./queries/tpopKarte.js')
const queryTPopsKarte = require('./queries/tpopsKarte.js')
const queryTPopKarteAlle = require('./queries/tpopKarteAlle.js')
const exportView = require('./queries/exportView.js')
const getKmlForPop = require('./src/getKmlForPop.js')
const getKmlForTpop = require('./src/getKmlForTpop.js')

connectionApflora.connect()

server.register(Inert, function () {
  server.connection(require('./dbConnection.js'))
  server.route(require('./routes/anyGet.js'))
  server.route(require('./routes/srcGet.js'))
  server.route(require('./routes/styleImagesGet.js'))

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

  /**
   * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
   * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
   * und im reply zu einem Objekt zusammengefasst werden
   * Beispiel: BeoListe, FeldListe, tree
   */

  server.route({
    method: 'GET',
    path: '/tree/apId={apId}',
    config: {
      pre: [
        [
          { method: treeAssozarten, assign: 'assozarten' },
          { method: treeIdealbiotop, assign: 'idealbiotop' },
          { method: treeBeobNichtZuzuordnen, assign: 'beobNichtZuzuordnen' },
          { method: treeBeobNichtBeurteilt, assign: 'beobNichtBeurteilt' },
          { method: treeBer, assign: 'ber' },
          { method: treeJBer, assign: 'jber' },
          { method: treeErfkrit, assign: 'erfkrit' },
          { method: treeApziel, assign: 'apziel' },
          { method: treePop, assign: 'pop' },
          { method: treeQualitaetskontrollen, assign: 'qualitaetskontrollen' }
        ]

      ],
      handler (request, reply) {
        reply([
          request.pre.qualitaetskontrollen,
          request.pre.pop,
          request.pre.apziel,
          request.pre.erfkrit,
          request.pre.jber,
          request.pre.ber,
          request.pre.beobNichtBeurteilt,
          request.pre.beobNichtZuzuordnen,
          request.pre.idealbiotop,
          request.pre.assozarten
        ])
      }
    }

  })

  server.route(require('./routes/beobDistzutpopEvabGet.js'))

  server.route({
    method: 'GET',
    path: '/beobDistzutpopInfospezies/beobId={beobId}',
    handler: queryBeobDistzutpopInfospezies
  })

  server.route(require('./routes/beobNaechsteTpopGet.js'))
  server.route(require('./routes/beobKarteGet.js'))
  server.route(require('./routes/beobZuordnenGet.js'))
  server.route(require('./routes/apKarteGet.js'))

  server.route({
    method: 'GET',
    path: '/popKarte/popId={popId}',
    handler: queryPopKarte
  })

  server.route({
    method: 'GET',
    path: '/popKarteAlle/apId={apId}',
    handler: queryPopKarteAlle
  })

  server.route({
    method: 'GET',
    path: '/popChKarte/popId={popId}',
    handler: queryPopChKarte
  })

  server.route({
    method: 'GET',
    path: '/popsChKarte/apId={apId}',
    handler: queryPopsChKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopKarte/tpopId={tpopId}',
    handler: queryTPopKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopsKarte/popId={popId}',
    handler: queryTPopsKarte
  })

  server.route({
    method: 'GET',
    path: '/tpopKarteAlle/apId={apId}',
    handler: queryTPopKarteAlle
  })

  server.route({
    method: 'GET',
    path: '/exportView/xslx/view={view}',
    // handler: exportView
    handler (request, reply) {
      exportView(request, (err, data) => {
        if (err) return reply(err)
        reply(data)
          .header('Content-Type', 'application/json;')
          .header('Accept', 'application/json;')
          // .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
          .header('Pragma', 'no-cache')
      // .header('Set-Cookie', 'fileDownload=true; path=/')
      })
    }
  })

  server.route(require('./routes/exportViewGetCsv.js'))
  server.route(require('./routes/exportViewGetCsvForAp.js'))
  server.route(require('./routes/exportViewWhereIdInGet.js'))

  server.route({
    method: 'GET',
    path: '/exportView/kml/view={view}/filename={filename}',
    handler (request, reply) {
      const filename = request.params.filename
      const view = request.params.view
      let kml

      exportView(request, (err, data) => {
        if (err) return reply(err)
        switch (view) {
          case 'v_pop_kml':
          case 'v_pop_kmlnamen':
            kml = getKmlForPop(data)
            break
          case 'v_tpop_kml':
          case 'v_tpop_kmlnamen':
            kml = getKmlForTpop(data)
            break
        }
        if (kml) {
          reply(kml)
            .header('Content-Type', 'application/vnd.google-earth.kml+xml kml; charset=utf-8')
            .header('Content-disposition', `attachment; filename=${filename}.kml`)
            .header('Pragma', 'no-cache')
            .header('Set-Cookie', 'fileDownload=true; path=/')
        }
      })
    }
  })

  server.route(require('./routes/aktualisiereArteigenschaftenGet.js'))
})

server.start(function (err) {
  if (err) throw err
  console.log('Server running at:', server.info.uri)
})

module.exports = server
