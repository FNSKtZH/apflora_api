/**
 * startet die Anwendung, indem der Server gestartet wird
 */

'use strict'

var _ = require('underscore')
var json2csv = require('json2csv')
// wird nur in Entwicklung genutzt
/*
var serverOptionsDevelopment = {
  debug: {
    log: ['error'],
    request: ['error']
  }
},
*/
var Hapi = require('hapi')
var Inert = require('inert')
var server = new Hapi.Server()
var mysql = require('mysql')
var config = require('./configuration')
var connectionApflora = mysql.createConnection({
  host: 'localhost',
  user: config.db.userName,
  password: config.db.passWord,
  database: 'apflora'
})
var queryGemeinden = require('./queries/gemeinden')
var queryArtliste = require('./queries/artliste')
var queryApliste = require('./queries/apliste')
var queryQkView = require('./queries/qkView')
var queryQkPopOhnePopber = require('./queries/qkPopOhnePopber')
var queryQkPopOhnePopmassnber = require('./queries/qkPopOhnePopmassnber')
var queryQkTpopOhneTpopber = require('./queries/qkTpopOhneTpopber')
var queryQkTpopOhneMassnber = require('./queries/qkTpopOhneMassnber')
var queryAdressen = require('./queries/adressen')
var queryLrDelarze = require('./queries/lrDelarze')
var queryTpopMassnTypen = require('./queries/tpopMassnTypen')
var queryAp = require('./queries/ap')
var queryApInsert = require('./queries/apInsert')
var queryFeldkontrZaehleinheit = require('./queries/feldkontrZaehleinheit')
var queryIdealbiotopUebereinst = require('./queries/idealbiotopUebereinst')
var queryTabelleSelectApfloraNumber = require('./queries/tabelleSelectApfloraNumber')
var queryTabelleSelectApfloraString = require('./queries/tabelleSelectApfloraString')
var queryTabelleSelectBeobNumber = require('./queries/tabelleSelectBeobNumber')
var queryTabelleSelectBeobString = require('./queries/tabelleSelectBeobString')
var queryTabelleInsertApflora = require('./queries/tabelleInsertApflora')
var queryTabelleInsertMultipleApflora = require('./queries/tabelleInsertMultipleApflora')
var queryTpopmassnInsertKopie = require('./queries/tpopmassnInsertKopie')
var queryTpopkontrInsertKopie = require('./queries/tpopkontrInsertKopie')
var queryTpopInsertKopie = require('./queries/tpopInsertKopie')
var queryTpopKoordFuerProgramm = require('./queries/tpopKoordFuerProgramm')
var queryPopInsertKopie = require('./queries/popInsertKopie')
var queryFeldkontrInsert = require('./queries/feldkontrInsert')
var queryTabelleUpdateApflora = require('./queries/tabelleUpdateApflora')
var queryTabelleUpdateMultipleApflora = require('./queries/tabelleUpdateMultipleApflora')
var queryTabelleUpdateBeob = require('./queries/tabelleUpdateBeob')
var queryTabelleDeleteApflora = require('./queries/tabelleDeleteApflora')
var queryAnmeldung = require('./queries/anmeldung')
var treeQualitaetskontrollen = require('./queries/tree/qualitaetskontrollen')
var treeAssozarten = require('./queries/tree/assozarten')
var treeIdealbiotop = require('./queries/tree/idealbiotop')
var treeBeobNichtZuzuordnen = require('./queries/tree/beobNichtZuzuordnen')
var treeBeobNichtBeurteilt = require('./queries/tree/beobNichtBeurteilt')
var treeBer = require('./queries/tree/ber')
var treeJBer = require('./queries/tree/jber')
var treeErfkrit = require('./queries/tree/erfkrit')
var treeApziel = require('./queries/tree/apziel')
var treePop = require('./queries/tree/pop')
var queryBeobDistzutpopEvab = require('./queries/beobDistzutpopEvab')
var queryBeobNaechsteTpop = require('./queries/beobNaechsteTpop')
var queryBeobDistzutpopInfospezies = require('./queries/beobDistzutpopInfospezies')
var queryBeobKarte = require('./queries/beobKarte')
var queryBeobZuordnen = require('./queries/beobZuordnen')
var queryApKarte = require('./queries/apKarte')
var queryPopKarte = require('./queries/popKarte')
var queryPopKarteAlle = require('./queries/popKarteAlle')
var queryPopChKarte = require('./queries/popChKarte')
var queryPopsChKarte = require('./queries/popsChKarte')
var queryTPopKarte = require('./queries/tpopKarte')
var queryTPopsKarte = require('./queries/tpopsKarte')
var queryTPopKarteAlle = require('./queries/tpopKarteAlle')
var exportView = require('./queries/exportView')
var exportViewWhereIdIn = require('./queries/exportViewWhereIdIn')
var getKmlForPop = require('./src/getKmlForPop')
var getKmlForTpop = require('./src/getKmlForTpop')
var aktualisiereArteigenschaften = require('./queries/aktualisiereArteigenschaften')

connectionApflora.connect()

server.register(Inert, function () {
  server.connection({
    host: '0.0.0.0',
    port: 4001,
    routes: {
      cors: true
    }
  })

  server.start(function (err) {
    if (err) throw err
    console.log('Server running at:', server.info.uri)
  })

  server.route({
    method: 'GET',
    path: '/{path*}',
    handler: function (request, reply) {
      reply.file('index.html')
    }
  })

  server.route({
    method: 'GET',
    path: '/src/{param*}',
    handler: {
      directory: {
        path: 'src'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/style/images/{param*}',
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
    handler: {
      directory: {
        path: 'etc'
      }
    }
  })

  /*server.route({
      method: 'GET',
      path: '/etc/beziehungen.png',
      // vhost: ['api.apflora.ch', 'api.localhost'],
    handler: function (request, reply) {
          reply.file('etc/beziehungen.png')
      }
  });*/

  server.route({
    method: 'GET',
    path: '/style/{param*}',
    handler: {
      directory: {
        path: 'style'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/kml/{param*}',
    handler: {
      directory: {
        path: 'kml'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/geojson/{param*}',
    handler: {
      directory: {
        path: 'geojson'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/img/{param*}',
    handler: {
      directory: {
        path: 'img'
      }
    }
  })

  server.route({
    method: 'GET',
    path: '/gemeinden',
    handler: queryGemeinden
  })

  server.route({
    method: 'GET',
    path: '/artliste',
    handler: queryArtliste
  })

  server.route({
    method: 'GET',
    path: '/apliste/programm={programm}',
    handler: queryApliste
  })

  server.route({
    method: 'GET',
    path: '/qkView/{viewName}/{apId}/{berichtjahr?}',
    handler: queryQkView
  })

  server.route({
    method: 'GET',
    path: '/qkPopOhnePopber/{apId}/{berichtjahr}',
    handler: queryQkPopOhnePopber
  })

  server.route({
    method: 'GET',
    path: '/qkPopOhnePopmassnber/{apId}/{berichtjahr}',
    handler: queryQkPopOhnePopmassnber
  })

  server.route({
    method: 'GET',
    path: '/qkTpopOhneTpopber/{apId}/{berichtjahr}',
    handler: queryQkTpopOhneTpopber
  })

  server.route({
    method: 'GET',
    path: '/qkTpopOhneMassnber/{apId}/{berichtjahr}',
    handler: queryQkTpopOhneMassnber
  })

  server.route({
    method: 'GET',
    path: '/anmeldung/name={name}/pwd={pwd}',
    handler: queryAnmeldung
  })

  server.route({
    method: 'GET',
    path: '/adressen',
    handler: queryAdressen
  })

  server.route({
    method: 'GET',
    path: '/apflora/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectApfloraNumber
  })

  server.route({
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertNumber={wert}',
    handler: queryTabelleSelectBeobNumber
  })

  server.route({
    method: 'GET',
    path: '/apflora/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectApfloraString
  })

  server.route({
    method: 'GET',
    path: '/beob/tabelle={tabelle}/feld={feld}/wertString={wert}',
    handler: queryTabelleSelectBeobString
  })

  server.route({
    method: 'POST',
    path: '/update/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateApflora
  })

  server.route({
    method: 'POST',
    path: '/updateMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleUpdateMultipleApflora
  })

  server.route({
    method: 'POST',
    path: '/update/beob/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}/feld={feld}/wert={wert?}/user={user}',
    handler: queryTabelleUpdateBeob
  })

  server.route({
    method: 'POST',
    path: '/insert/apflora/tabelle={tabelle}/feld={feld}/wert={wert}/user={user}',
    handler: queryTabelleInsertApflora
  })

  server.route({
    method: 'POST',
    path: '/insertMultiple/apflora/tabelle={tabelle}/felder={felder}',
    handler: queryTabelleInsertMultipleApflora
  })

  server.route({
    method: 'POST',
    path: '/tpopmassnInsertKopie/tpopId={tpopId}/tpopMassnId={tpopMassnId}/user={user}',
    handler: queryTpopmassnInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/tpopkontrInsertKopie/tpopId={tpopId}/tpopKontrId={tpopKontrId}/user={user}',
    handler: queryTpopkontrInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/tpopInsertKopie/popId={popId}/tpopId={tpopId}/user={user}',
    handler: queryTpopInsertKopie
  })

  server.route({
    method: 'GET',
    path: '/tpopKoordFuerProgramm/apId={apId}',
    handler: queryTpopKoordFuerProgramm
  })

  server.route({
    method: 'POST',
    path: '/popInsertKopie/apId={apId}/popId={popId}/user={user}',
    handler: queryPopInsertKopie
  })

  server.route({
    method: 'POST',
    path: '/insert/feldkontr/tpopId={tpopId}/tpopKontrtyp={tpopKontrtyp?}/user={user}',
    handler: queryFeldkontrInsert
  })

  server.route({
    method: 'DELETE',
    path: '/apflora/tabelle={tabelle}/tabelleIdFeld={tabelleIdFeld}/tabelleId={tabelleId}',
    handler: queryTabelleDeleteApflora
  })

  server.route({
    method: 'GET',
    path: '/lrDelarze',
    handler: queryLrDelarze
  })

  server.route({
    method: 'GET',
    path: '/tpopMassnTypen',
    handler: queryTpopMassnTypen
  })

  server.route({
    method: 'GET',
    path: '/ap={apId}',
    handler: queryAp
  })

  server.route({
    method: 'POST',
    path: '/apInsert/apId={apId}/user={user}',
    handler: queryApInsert
  })

  server.route({
    method: 'GET',
    path: '/feldkontrZaehleinheit',
    handler: queryFeldkontrZaehleinheit
  })

  server.route({
    method: 'GET',
    path: '/idealbiotopUebereinst',
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
    handler: queryBeobDistzutpopEvab
  })

  server.route({
    method: 'GET',
    path: '/beobDistzutpopInfospezies/beobId={beobId}',
    handler: queryBeobDistzutpopInfospezies
  })

  server.route({
    method: 'GET',
    path: '/beobNaechsteTpop/apId={apId}/X={X}/Y={Y}',
    handler: queryBeobNaechsteTpop
  })

  server.route({
    method: 'GET',
    path: '/beobKarte/apId={apId?}/tpopId={tpopId?}/beobId={beobId?}/nichtZuzuordnen={nichtZuzuordnen?}',
    handler: queryBeobKarte
  })

  server.route({
    method: 'GET',
    path: '/beobZuordnen/apId={apId}',
    handler: queryBeobZuordnen
  })

  server.route({
    method: 'GET',
    path: '/apKarte/apId={apId}',
    handler: queryApKarte
  })

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
    path: '/exportView/csv/view={view}/filename={filename}/{apId}',
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
    handler: function (request, reply) {
      var filename = request.params.filename
      exportViewWhereIdIn(request, function (err, data) {
        if (err) { return reply(err) }
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
    handler: function (request, reply) {
      aktualisiereArteigenschaften(request, reply)
    }
  })

})
