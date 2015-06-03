/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

var _ = require('underscore'),
  json2csv = require('json2csv'),
  // wird nur in Entwicklung genutzt
  /*serverOptionsDevelopment = {
    debug: {
      log: ['error'],
      request: ['error']
    }
  },*/
  Hapi = require('hapi'),
  server = new Hapi.Server(),
  mysql = require('mysql'),
  config = require('./configuration'),
  connectionApflora = mysql.createConnection({
    host: 'localhost',
    user: config.db.userName,
    password: config.db.passWord,
    database: 'apflora'
  }),
  queryGemeinden = require('./queries/gemeinden'),
  queryArtliste = require('./queries/artliste'),
  queryApliste = require('./queries/apliste'),
  queryQkView = require('./queries/qkView'),
  queryQkPopOhnePopber = require('./queries/qkPopOhnePopber'),
  queryQkPopOhnePopmassnber = require('./queries/qkPopOhnePopmassnber'),
  queryQkTpopOhneTpopber = require('./queries/qkTpopOhneTpopber'),
  queryQkTpopOhneMassnber = require('./queries/qkTpopOhneMassnber'),
  queryAdressen = require('./queries/adressen'),
  queryLrDelarze = require('./queries/lrDelarze'),
  queryTpopMassnTypen = require('./queries/tpopMassnTypen'),
  queryAp = require('./queries/ap'),
  queryApInsert = require('./queries/apInsert'),
  queryFeldkontrZaehleinheit = require('./queries/feldkontrZaehleinheit'),
  queryIdealbiotopUebereinst = require('./queries/idealbiotopUebereinst'),
  queryTabelleSelectApfloraNumber = require('./queries/tabelleSelectApfloraNumber'),
  queryTabelleSelectApfloraString = require('./queries/tabelleSelectApfloraString'),
  queryTabelleSelectBeobNumber = require('./queries/tabelleSelectBeobNumber'),
  queryTabelleSelectBeobString = require('./queries/tabelleSelectBeobString'),
  queryTabelleInsertApflora = require('./queries/tabelleInsertApflora'),
  queryTabelleInsertMultipleApflora = require('./queries/tabelleInsertMultipleApflora'),
  queryTpopmassnInsertKopie = require('./queries/tpopmassnInsertKopie'),
  queryTpopkontrInsertKopie = require('./queries/tpopkontrInsertKopie'),
  queryTpopInsertKopie = require('./queries/tpopInsertKopie'),
  queryTpopKoordFuerProgramm = require('./queries/tpopKoordFuerProgramm'),
  queryPopInsertKopie = require('./queries/popInsertKopie'),
  queryFeldkontrInsert = require('./queries/feldkontrInsert'),
  queryTabelleUpdateApflora = require('./queries/tabelleUpdateApflora'),
  queryTabelleUpdateMultipleApflora = require('./queries/tabelleUpdateMultipleApflora'),
  queryTabelleUpdateBeob = require('./queries/tabelleUpdateBeob'),
  queryTabelleDeleteApflora = require('./queries/tabelleDeleteApflora'),
  queryAnmeldung = require('./queries/anmeldung'),
  treeQualitaetskontrollen = require('./queries/tree/qualitaetskontrollen'),
  treeAssozarten = require('./queries/tree/assozarten'),
  treeIdealbiotop = require('./queries/tree/idealbiotop'),
  treeBeobNichtZuzuordnen = require('./queries/tree/beobNichtZuzuordnen'),
  treeBeobNichtBeurteilt = require('./queries/tree/beobNichtBeurteilt'),
  treeBer = require('./queries/tree/ber'),
  treeJBer = require('./queries/tree/jber'),
  treeErfkrit = require('./queries/tree/erfkrit'),
  treeApziel = require('./queries/tree/apziel'),
  treePop = require('./queries/tree/pop'),
  queryBeobDistzutpopEvab = require('./queries/beobDistzutpopEvab'),
  queryBeobNaechsteTpop = require('./queries/beobNaechsteTpop'),
  queryBeobDistzutpopInfospezies = require('./queries/beobDistzutpopInfospezies'),
  queryBeobKarte = require('./queries/beobKarte'),
  queryBeobZuordnen = require('./queries/beobZuordnen'),
  queryApKarte = require('./queries/apKarte'),
  queryPopKarte = require('./queries/popKarte'),
  queryPopKarteAlle = require('./queries/popKarteAlle'),
  queryPopChKarte = require('./queries/popChKarte'),
  queryPopsChKarte = require('./queries/popsChKarte'),
  queryTPopKarte = require('./queries/tpopKarte'),
  queryTPopsKarte = require('./queries/tpopsKarte'),
  queryTPopKarteAlle = require('./queries/tpopKarteAlle'),
  exportView = require('./queries/exportView'),
  exportViewWhereIdIn = require('./queries/exportViewWhereIdIn'),
  getKmlForPop = require('./src/getKmlForPop'),
  getKmlForTpop = require('./src/getKmlForTpop'),
  aktualisiereArteigenschaften = require('./queries/aktualisiereArteigenschaften'),
  isWindows = require('./src/isWindows'),
  origin

connectionApflora.connect()

origin = isWindows() ? 'http://localhost:4000' : 'http://apflora.ch'

server.connection({
  host: '0.0.0.0',
  port: 4001,
  routes: {
    cors: {
      origin: [origin]
    }
  }
})

server.start(function (err) {
  if (err) {
    throw err
  }
  console.log('Server running at:', server.info.uri)
})

server.route({
  method: 'GET',
  path: '/{path*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    reply.file('index.html')
  }
})

server.route({
  method: 'GET',
  path: '/src/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'src'
    }
  }
})

server.route({
  method: 'GET',
  path: '/style/images/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'style/images'
    }
  }
})

/* Versuch, funktioniert nicht*/
server.route({
  method: 'GET',
  path: '/etc/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'etc'
    }
  }
})

/*server.route({
    method: 'GET',
    path: '/etc/beziehungen.png',
    vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
        reply.file('etc/beziehungen.png')
    }
});*/

server.route({
  method: 'GET',
  path: '/style/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'style'
    }
  }
})

server.route({
  method: 'GET',
  path: '/kml/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'kml'
    }
  }
})

server.route({
  method: 'GET',
  path: '/geojson/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'geojson'
    }
  }
})

server.route({
  method: 'GET',
  path: '/img/{param*}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: {
    directory: {
      path: 'img'
    }
  }
})

server.route({
  method: 'GET',
  path: '/gemeinden',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryGemeinden
})

server.route({
  method: 'GET',
  path: '/artliste',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryArtliste
})

server.route({
  method: 'GET',
  path: '/apliste/programm={programm}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryApliste
})

server.route({
  method: 'GET',
  path: '/qkView/{viewName}/{apId}/{berichtjahr?}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryQkView
})

server.route({
  method: 'GET',
  path: '/qkPopOhnePopber/{apId}/{berichtjahr}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryQkPopOhnePopber
})

server.route({
  method: 'GET',
  path: '/qkPopOhnePopmassnber/{apId}/{berichtjahr}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryQkPopOhnePopmassnber
})

server.route({
  method: 'GET',
  path: '/qkTpopOhneTpopber/{apId}/{berichtjahr}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryQkTpopOhneTpopber
})

server.route({
  method: 'GET',
  path: '/qkTpopOhneMassnber/{apId}/{berichtjahr}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryQkTpopOhneMassnber
})

server.route({
  method: 'GET',
  path: '/anmeldung/name={name}/pwd={pwd}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryAnmeldung
})

server.route({
  method: 'GET',
  path: '/adressen',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryAdressen
})

server.route({
  method: 'GET',
  path: '/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleSelectApfloraNumber
})

server.route({
  method: 'GET',
  path: '/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleSelectBeobNumber
})

server.route({
  method: 'GET',
  path: '/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleSelectApfloraString
})

server.route({
  method: 'GET',
  path: '/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleSelectBeobString
})

server.route({
  method: 'POST',
  path: '/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleUpdateApflora
})

server.route({
  method: 'POST',
  path: '/updateMultiple/apflora/tabelle={tabelle}/felder={felder}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleUpdateMultipleApflora
})

server.route({
  method: 'POST',
  path: '/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleUpdateBeob
})

server.route({
  method: 'POST',
  path: '/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleInsertApflora
})

server.route({
  method: 'POST',
  path: '/insertMultiple/apflora/tabelle={tabelle}/felder={felder}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleInsertMultipleApflora
})

server.route({
  method: 'POST',
  path: '/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTpopmassnInsertKopie
})

server.route({
  method: 'POST',
  path: '/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTpopkontrInsertKopie
})

server.route({
  method: 'POST',
  path: '/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTpopInsertKopie
})

server.route({
  method: 'GET',
  path: '/tpopKoordFuerProgramm/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTpopKoordFuerProgramm
})

server.route({
  method: 'POST',
  path: '/popInsertKopie/apId={apId}/popId={popId}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryPopInsertKopie
})

server.route({
  method: 'POST',
  path: '/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryFeldkontrInsert
})

server.route({
  method: 'DELETE',
  path: '/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTabelleDeleteApflora
})

server.route({
  method: 'GET',
  path: '/lrDelarze',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryLrDelarze
})

server.route({
  method: 'GET',
  path: '/tpopMassnTypen',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTpopMassnTypen
})

server.route({
  method: 'GET',
  path: '/ap={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryAp
})

server.route({
  method: 'POST',
  path: '/apInsert/apId={apId}/user={user}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryApInsert
})

server.route({
  method: 'GET',
  path: '/feldkontrZaehleinheit',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryFeldkontrZaehleinheit
})

server.route({
  method: 'GET',
  path: '/idealbiotopUebereinst',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryIdealbiotopUebereinst
})

/**
 * Wenn mehrere DB-Aufrufe nötig sind, können sie parallel getätigt werden:
 * pre: ... (siehe http://blog.andyet.com/tag/node bei 20min)
 * und im reply zu einem Objekt zusammengefasst werden
 * Beispiel: BeoListe, FeldListe, tree
 */

server.route({
  method: 'GET',
  path: '/tree/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
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
    handler: function (request, reply) {
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

server.route({
  method: 'GET',
  path: '/beobDistzutpopEvab/beobId={beobId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryBeobDistzutpopEvab
})

server.route({
  method: 'GET',
  path: '/beobDistzutpopInfospezies/beobId={beobId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryBeobDistzutpopInfospezies
})

server.route({
  method: 'GET',
  path: '/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryBeobNaechsteTpop
})

server.route({
  method: 'GET',
  path: '/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryBeobKarte
})

server.route({
  method: 'GET',
  path: '/beobZuordnen/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryBeobZuordnen
})

server.route({
  method: 'GET',
  path: '/apKarte/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryApKarte
})

server.route({
  method: 'GET',
  path: '/popKarte/popId={popId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryPopKarte
})

server.route({
  method: 'GET',
  path: '/popKarteAlle/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryPopKarteAlle
})

server.route({
  method: 'GET',
  path: '/popChKarte/popId={popId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryPopChKarte
})

server.route({
  method: 'GET',
  path: '/popsChKarte/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryPopsChKarte
})

server.route({
  method: 'GET',
  path: '/tpopKarte/tpopId={tpopId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTPopKarte
})

server.route({
  method: 'GET',
  path: '/tpopsKarte/popId={popId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTPopsKarte
})

server.route({
  method: 'GET',
  path: '/tpopKarteAlle/apId={apId}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: queryTPopKarteAlle
})

server.route({
  method: 'GET',
  path: '/exportView/xslx/view={view}',
  // handler: exportView
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    exportView(request, function (err, data) {
      if (err) { return reply(err) }
      reply(data)
        .header('Content-Type', 'application/json;')
        .header('Accept', 'application/json;')
        // .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
        .header('Pragma', 'no-cache')
    // .header('Set-Cookie', 'fileDownload=true; path=/')
    })
  }
})

server.route({
  method: 'GET',
  path: '/exportView/csv/view={view}/filename={filename}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    var filename = request.params.filename
    exportView(request, function (err, data) {
      var fields = _.keys(data[0])
      if (err) { return reply(err) }
      json2csv({
        data: data,
        fields: fields
      }, function (err, csv) {
        if (err) {
          return reply(err)
        }
        reply(csv)
          .header('Content-Type', 'text/x-csv; charset=utf-8')
          .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
          .header('Pragma', 'no-cache')
          .header('Set-Cookie', 'fileDownload=true; path=/')
      })
    })
  }
})

server.route({
  method: 'GET',
  path: '/exportViewWhereIdIn/csv/view={view}/idName={idName}/idListe={idListe}/filename={filename}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    var filename = request.params.filename
    exportViewWhereIdIn(request, function (data) {
      var fields = _.keys(data[0])
      json2csv({
        data: data,
        fields: fields
      }, function (err, csv) {
        if (err) { return reply(err) }
        reply(csv)
          .header('Content-Type', 'text/x-csv; charset=utf-8')
          .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
          .header('Pragma', 'no-cache')
          .header('Set-Cookie', 'fileDownload=true; path=/')
      })
    })
  }
})

server.route({
  method: 'GET',
  path: '/exportView/kml/view={view}/filename={filename}',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    var filename = request.params.filename,
      view = request.params.view,
      kml

    exportView(request, function (err, data) {
      if (err) { return reply(err) }
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
          .header('Content-disposition', 'attachment; filename=' + filename + '.kml')
          .header('Pragma', 'no-cache')
          .header('Set-Cookie', 'fileDownload=true; path=/')
      }
    })
  }
})

server.route({
  method: 'GET',
  path: '/aktualisiereArteigenschaften',
  vhost: ['api.apflora.ch', 'api.localhost'],
  handler: function (request, reply) {
    aktualisiereArteigenschaften(request, reply)
  }
})
